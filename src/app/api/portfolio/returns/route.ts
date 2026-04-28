import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Holding } from "@/lib/models/Holding";
import mongoose from "mongoose";

type Range = "1m" | "6m" | "12m";

async function calculatePortfolioReturn(
  userId: mongoose.Types.ObjectId,
  range: Range,
): Promise<number> {
  const holdings = await Holding.find({ userId }).lean();

  if (holdings.length === 0) return 0;

  const totalValue = holdings.reduce((sum, h) => sum + h.amount, 0);
  if (totalValue === 0) return 0;

  let totalWeightedReturn = 0;

  for (const holding of holdings) {
    let holdingReturn = holding.return1m || 0;

    switch (range) {
      case "6m":
        holdingReturn = holdingReturn * 6;
        break;
      case "12m":
        holdingReturn = holdingReturn * 12;
        break;
      default: // "1m"
        break;
    }

    const weight = holding.amount / totalValue;
    totalWeightedReturn += holdingReturn * weight;
  }

  return Number(totalWeightedReturn.toFixed(2));
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = request.nextUrl.searchParams.get("range") as Range;

  if (!range || !["1m", "6m", "12m"].includes(range)) {
    return NextResponse.json(
      { error: "Invalid range. Use 1m, 6m, or 12m" },
      { status: 400 },
    );
  }

  await connectDB();

  const userId = new mongoose.Types.ObjectId(session.sub);
  const portfolioReturn = await calculatePortfolioReturn(userId, range);

  return NextResponse.json({
    range,
    return: portfolioReturn,
  });
}
