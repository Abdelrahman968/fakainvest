import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction, Wallet } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const wallet = await Wallet.findOne({ userId: session.sub });

  const pendingTransactions = await Transaction.find({
    userId: session.sub,
    roundUp: { $gt: 0 },
    isRoundUpProcessed: false,
  });

  const totalFromTransactions = pendingTransactions.reduce(
    (sum, t) => sum + (t.roundUp || 0),
    0,
  );

  return NextResponse.json({
    walletPending: wallet?.pendingRoundUps || 0,
    transactionsPending: totalFromTransactions,
    total: Math.max(wallet?.pendingRoundUps || 0, totalFromTransactions),
    transactionCount: pendingTransactions.length,
  });
}
