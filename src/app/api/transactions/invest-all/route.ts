import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";
import { Wallet } from "@/lib/models/Wallet";
import { Holding } from "@/lib/models/Holding";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pendingTransactions = await Transaction.find({
      userId: session.sub,
      status: "Pending",
    });

    if (pendingTransactions.length === 0) {
      return NextResponse.json(
        { error: "No pending transactions" },
        { status: 400 },
      );
    }

    const totalRoundUp = pendingTransactions.reduce(
      (sum, t) => sum + t.roundUp,
      0,
    );

    // Update transactions status to Completed
    await Transaction.updateMany(
      { userId: session.sub, status: "Pending" },
      { status: "Completed" },
    );

    // Update wallet balance
    await Wallet.updateOne(
      { userId: session.sub },
      { $inc: { balance: totalRoundUp } },
      { upsert: true },
    );

    await Holding.create({
      userId: session.sub,
      name: "Auto-invest Round-ups",
      type: "Money Market",
      amount: totalRoundUp,
      return1m: 0,
      color: "210 55% 47%",
      // transactionIds: pendingTransactions.map((t) => t.id),
    });

    return NextResponse.json({
      success: true,
      investedCount: pendingTransactions.length,
      totalAmount: totalRoundUp,
    });
  } catch (error) {
    console.error("Error investing all:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
