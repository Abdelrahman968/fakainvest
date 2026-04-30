import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";
import { Goal } from "@/lib/models/Goal";
import { Holding } from "@/lib/models/Holding";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.sub;

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: threeMonthsAgo.toISOString().slice(0, 10) },
    }).lean();

    const expenses = transactions.filter((t) => t.amount < 0);
    const avgMonthlySpending =
      expenses.length > 0
        ? expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0) / 3
        : 0;

    const nextGoal = await Goal.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ deadline: 1 })
      .lean();

    const holdings = await Holding.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    const totalAmount = holdings.reduce((sum, h) => sum + (h.amount || 0), 0);
    const stocksAmount = holdings
      .filter((h) => h.type === "Stocks")
      .reduce((sum, h) => sum + (h.amount || 0), 0);
    const stocksPercentage =
      totalAmount > 0 ? (stocksAmount / totalAmount) * 100 : 0;
    const targetStocks = 22.5;
    const drift = stocksPercentage - targetStocks;

    const portfolioReturn =
      holdings.reduce((sum, h) => sum + (h.return1m || 0), 0) /
      (holdings.length || 1);
    const inflationRate = 18.2;

    const predictions = [
      {
        id: "ap1",
        title: "End-of-month projection",
        tkey: "ap1",
        value: `EGP ${Math.round(avgMonthlySpending).toLocaleString()}`,
        change: 3.3,
        emoji: "🎯",
        desc: "Based on current pace",
        ap1DescKey: "ap1Desc",
      },
      {
        id: "ap2",
        title: "Next major goal hit",
        tkey: "ap2",
        value: nextGoal?.deadline
          ? new Date(nextGoal.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No active goals",
        change: 0,
        emoji: "📅",
        desc: nextGoal?.title || "Create a goal to start saving",
        ap2DescKey: "ap2Desc",
      },
      {
        id: "ap3",
        title: "Allocation drift",
        tkey: "ap3",
        value: `${drift > 0 ? "+" : ""}${drift.toFixed(1)}%`,
        change: drift > 0 ? -1 : 1,
        emoji: "⚖️",
        desc: drift > 0 ? "Overweight in stocks" : "Underweight in stocks",
        ap3DescKey: "ap3Desc",
      },
      {
        id: "ap4",
        title: "Inflation buffer",
        tkey: "ap4",
        value: `${(portfolioReturn - inflationRate).toFixed(1)}%`,
        change: 4.1,
        emoji: "🛡️",
        desc:
          portfolioReturn > inflationRate
            ? "Beating EGP inflation"
            : "Below inflation rate",
        ap4DescKey: "ap4Desc",
      },
    ];

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
