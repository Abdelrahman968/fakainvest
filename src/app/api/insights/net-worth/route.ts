import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";
import { Holding } from "@/lib/models/Holding";
import { Wallet } from "@/lib/models/Wallet";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.sub;

    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 11);

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: twelveMonthsAgo.toISOString().slice(0, 10) },
    }).lean();

    const wallet = await Wallet.findOne({ userId }).lean();
    const walletBalance = wallet?.balance || 0;

    const holdings = await Holding.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    const holdingsValue = holdings.reduce((sum, h) => sum + (h.amount || 0), 0);

    const netWorthData = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - (11 - i));
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const monthlyTransactions = transactions.filter((t) =>
        t.date?.startsWith(monthKey),
      );
      const monthlyIncome = monthlyTransactions
        .filter((t) => t.category === "Income" || t.amount > 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const monthlyExpenses = monthlyTransactions
        .filter((t) => t.category !== "Income" && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netWorth =
        walletBalance + holdingsValue + monthlyIncome - monthlyExpenses;

      netWorthData.push({
        month: monthName,
        value: Math.max(0, netWorth),
      });
    }

    return NextResponse.json({ series: netWorthData });
  } catch (error) {
    console.error("Error fetching net worth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
