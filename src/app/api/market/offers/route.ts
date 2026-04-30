import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { CashbackOffer } from "@/lib/models/CashbackOffer";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const offers = await CashbackOffer.find({
      isActive: true,
      endDate: { $gte: new Date() },
    })
      .sort({ cashbackValue: -1 })
      .lean();

    if (!offers || offers.length === 0) {
      return NextResponse.json({ offers: [] });
    }

    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("=== POST /api/market/offers ===");

    const session = await getSession();
    console.log("Session:", session?.sub);

    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);

    const {
      brand,
      category,
      cashback,
      cashbackValue,
      emoji,
      color,
      startDate,
      endDate,
    } = body;

    if (!brand || !category || !cashback || cashbackValue === undefined) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          error:
            "Missing required fields: brand, category, cashback, cashbackValue",
        },
        { status: 400 },
      );
    }

    await connectDB();
    console.log("Database connected");

    const offer = await CashbackOffer.create({
      brand,
      category,
      cashback,
      cashbackValue,
      emoji: emoji || "🛍️",
      color: color || "199 89% 60%",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate
        ? new Date(endDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    console.log("Offer created:", offer._id);

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
