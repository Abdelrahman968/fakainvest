import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import {
  Wallet,
  Transfer,
  Notification,
  Transaction,
  UserSettings,
} from "@/lib/models";
import mongoose from "mongoose";
import { calculateRoundUp, RoundUpMode } from "@/lib/roundup-engine";

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

  const userSettings = await UserSettings.findOne({ userId: session.sub });
  const roundUpMode = (userSettings?.roundUpMode || "Eco") as RoundUpMode;
  const roundUpEnabled = userSettings?.roundUpEnabled ?? true;
  const customRoundUpAmount = userSettings?.customRoundUpAmount || 10;

  let roundUpAmount = 0;
  let finalAmount = amount;
  let originalAmount = amount;

  if (roundUpEnabled && roundUpMode !== "None") {
    const calculation = calculateRoundUp(
      amount,
      roundUpMode,
      customRoundUpAmount,
    );
    roundUpAmount = calculation.roundUpAmount;
    finalAmount = calculation.finalAmount;
  }

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
    if (finalAmount > wallet.perTransactionLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Exceeds per-transaction limit of EGP ${wallet.perTransactionLimit}`,
        },
        { status: 422 },
      );
    }
    if (wallet.spentToday + finalAmount > wallet.dailyLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Daily limit of EGP ${wallet.dailyLimit} would be exceeded`,
        },
        { status: 422 },
      );
    }
    if (wallet.spentThisMonth + finalAmount > wallet.monthlyLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          ok: false,
          reason: `Monthly limit of EGP ${wallet.monthlyLimit} would be exceeded`,
        },
        { status: 422 },
      );
    }
    if (wallet.balance < finalAmount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { ok: false, reason: "Insufficient balance" },
        { status: 422 },
      );
    }

    wallet.balance -= finalAmount;
    wallet.spentToday += finalAmount;
    wallet.spentThisMonth += finalAmount;

    if (roundUpAmount > 0) {
      wallet.pendingRoundUps = (wallet.pendingRoundUps || 0) + roundUpAmount;
    }

    await wallet.save({ session: mongooseSession });

    const transfer = await Transfer.create(
      [
        {
          userId: session.sub,
          type: "card",
          counterparty: merchant,
          avatar: "💳",
          amount: finalAmount,
          method: "Card",
        },
      ],
      { session: mongooseSession },
    );

    const transaction = await Transaction.create(
      [
        {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.sub,
          merchant,
          category: "Shopping",
          amount: finalAmount,
          roundUp: roundUpAmount,
          originalAmount: roundUpAmount > 0 ? originalAmount : undefined,
          isRoundUpProcessed: false,
          date: new Date().toISOString(),
          status: "Completed",
        },
      ],
      { session: mongooseSession },
    );

    if (roundUpAmount > 0) {
      await Notification.create(
        [
          {
            userId: session.sub,
            title: "RoundUp Added!",
            body: `You saved EGP ${roundUpAmount.toFixed(2)} from your purchase at ${merchant}`,
            emoji: "💰",
            type: "success",
          },
        ],
        { session: mongooseSession },
      );
    }

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "Card Purchase",
          body:
            roundUpAmount > 0
              ? `You spent EGP ${finalAmount.toFixed(2)} (incl. EGP ${roundUpAmount.toFixed(2)} RoundUp) at ${merchant}`
              : `You spent EGP ${finalAmount.toFixed(2)} at ${merchant}`,
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
      transferId: transfer[0]?._id || transaction[0]?._id,
      roundUpAmount: roundUpAmount,
      originalAmount: originalAmount,
      finalAmount: finalAmount,
    });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("Card spend error:", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  } finally {
    mongooseSession.endSession();
  }
}
