import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Holding } from "@/lib/models/Holding";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.sub);

    const holdings = await Holding.find({ userId }).lean();
    const totalValue = holdings.reduce((sum, h) => sum + (h.amount || 0), 0);

    const targets = {
      "Savings Cert": 35,
      Stocks: 22.5,
      Gold: 20,
      "Money Market": 15,
      Sukuk: 7.5,
    };

    const actuals = {
      "Savings Cert": holdings
        .filter((h) => h.type === "Savings Cert")
        .reduce((sum, h) => sum + (h.amount || 0), 0),
      Stocks: holdings
        .filter((h) => h.type === "Stocks")
        .reduce((sum, h) => sum + (h.amount || 0), 0),
      Gold: holdings
        .filter((h) => h.type === "Gold")
        .reduce((sum, h) => sum + (h.amount || 0), 0),
      "Money Market": holdings
        .filter((h) => h.type === "Money Market")
        .reduce((sum, h) => sum + (h.amount || 0), 0),
      Sukuk: holdings
        .filter((h) => h.type === "Sukuk")
        .reduce((sum, h) => sum + (h.amount || 0), 0),
    };

    const colors: Record<string, string> = {
      "Savings Cert": "199 89% 60%",
      Stocks: "162 72% 45%",
      Gold: "45 90% 60%",
      "Money Market": "210 55% 47%",
      Sukuk: "270 60% 60%",
    };

    const allocationDrift = Object.keys(targets).map((name) => ({
      name,
      target: targets[name as keyof typeof targets],
      actual: Number(
        ((actuals[name as keyof typeof actuals] / totalValue) * 100).toFixed(1),
      ),
      color: colors[name],
    }));

    return NextResponse.json({ allocationDrift });
  } catch (error) {
    console.error("Error fetching allocation drift:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
