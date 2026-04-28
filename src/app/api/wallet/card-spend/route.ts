import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet, Transfer, Notification } from "@/lib/models";
import mongoose from "mongoose";

const schema = z.object({
  amount: z.number().positive(),
  merchant: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );

  const { amount, merchant } = parsed.data;

  await connectDB();

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    const wallet = await Wallet.findOne({ userId: session.sub }).session(
      mongooseSession,
    );
    if (!wallet) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const monthKey = new Date().toISOString().slice(0, 7);
    if (wallet.spentTodayDate !== today) {
      wallet.spentToday = 0;
      wallet.spentTodayDate = today;
    }
    if (wallet.spentMonthKey !== monthKey) {
      wallet.spentThisMonth = 0;
      wallet.spentMonthKey = monthKey;
    }

    if (wallet.frozen) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { ok: false, reason: "Card is frozen" },
        { status: 422 },
      );
    }
    if (amount > wallet.perTransactionLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Exceeds per-transaction limit of EGP ${wallet.perTransactionLimit}`,
        },
        { status: 422 },
      );
    }
    if (wallet.spentToday + amount > wallet.dailyLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Daily limit of EGP ${wallet.dailyLimit} would be exceeded`,
        },
        { status: 422 },
      );
    }
    if (wallet.spentThisMonth + amount > wallet.monthlyLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Monthly limit of EGP ${wallet.monthlyLimit} would be exceeded`,
        },
        { status: 422 },
      );
    }
    if (wallet.balance < amount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { ok: false, reason: "Insufficient balance" },
        { status: 422 },
      );
    }

    wallet.balance -= amount;
    wallet.spentToday += amount;
    wallet.spentThisMonth += amount;
    await wallet.save({ session: mongooseSession });

    const transfer = await Transfer.create(
      [
        {
          userId: session.sub,
          type: "card",
          counterparty: merchant,
          avatar: "💳",
          amount,
          method: "Card",
        },
      ],
      { session: mongooseSession },
    );

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "💳 Card Purchase",
          body: `You spent EGP ${amount.toLocaleString()} at ${merchant}`,
          emoji: "💳",
          type: "alert",
        },
      ],
      { session: mongooseSession },
    );

    await mongooseSession.commitTransaction();

    return NextResponse.json({
      ok: true,
      balance: wallet.balance,
      transferId: transfer[0]._id,
    });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("Card spend error:", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  } finally {
    mongooseSession.endSession();
  }
}
