import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.sub;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: thirtyDaysAgo.toISOString().slice(0, 10) },
      amount: { $lt: 0 },
    }).lean();

    const heatmap = Array(7)
      .fill(null)
      .map(() => Array(18).fill(0));

    for (const transaction of transactions) {
      const date = new Date(transaction.date);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      if (hour >= 6 && hour <= 23) {
        const hourIndex = hour - 6;
        const intensity = Math.min(
          10,
          Math.floor(Math.abs(transaction.amount) / 100),
        );
        heatmap[dayOfWeek][hourIndex] = Math.min(
          10,
          heatmap[dayOfWeek][hourIndex] + intensity,
        );
      }
    }

    const maxIntensity = Math.max(...heatmap.flat());
    const normalizedHeatmap = heatmap.map((row) =>
      row.map((v) =>
        maxIntensity > 0
          ? Math.min(10, Math.floor((v / maxIntensity) * 10))
          : 0,
      ),
    );

    return NextResponse.json({ heatmap: normalizedHeatmap });
  } catch (error) {
    console.error("Error fetching spending heatmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
