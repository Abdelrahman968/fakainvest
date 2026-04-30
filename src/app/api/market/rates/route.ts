import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { MarketRate } from "@/lib/models/MarketRate";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let rates = await MarketRate.find().sort({ order: 1 }).lean();

    if (!rates || rates.length === 0) {
      return NextResponse.json({ rates: [] });
    }

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Error fetching market rates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, value, unit, change, icon, color } = body;

    await connectDB();

    const rate = await MarketRate.create({
      name,
      value,
      unit,
      change,
      icon: icon || "📈",
      color: color || "199 89% 60%",
    });

    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("Error creating market rate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
