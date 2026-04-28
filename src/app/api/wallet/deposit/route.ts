import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet, Transfer, Notification } from "@/lib/models";
import mongoose from "mongoose";

const schema = z.object({
  amount: z.number().positive("Amount must be positive"),
  source: z.string().trim().min(1),
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

  const { amount, source } = parsed.data;

  await connectDB();

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId: session.sub },
      { $inc: { balance: amount } },
      { new: true, session: mongooseSession },
    );

    if (!wallet) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const transfer = await Transfer.create(
      [
        {
          userId: session.sub,
          type: "deposit",
          counterparty: source,
          avatar: "🏦",
          amount,
          method: "Bank",
        },
      ],
      { session: mongooseSession },
    );

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "🏦 Deposit Successful",
          body: `You deposited EGP ${amount.toLocaleString()} to your wallet`,
          emoji: "🏦",
          type: "alert",
        },
      ],
      { session: mongooseSession },
    );

    await mongooseSession.commitTransaction();

    return NextResponse.json({
      balance: wallet.balance,
      transferId: transfer[0]._id,
    });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("Deposit error:", error);
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 });
  } finally {
    mongooseSession.endSession();
  }
}
