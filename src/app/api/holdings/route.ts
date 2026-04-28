import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Holding, type LeanHolding } from "@/lib/models/Holding";
import mongoose from "mongoose";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const holdings = await Holding.find({
    userId: new mongoose.Types.ObjectId(session.sub),
  })
    .sort({ createdAt: -1 })
    .lean<LeanHolding[]>();

  const transformedHoldings = holdings.map((holding) => ({
    id: holding._id.toString(),
    user_id: holding.userId.toString(),
    name: holding.name,
    type: holding.type,
    amount: holding.amount,
    return1m: holding.return1m,
    color: holding.color,
    created_at: holding.createdAt.toISOString(),
    updated_at: holding.updatedAt.toISOString(),
  }));

  return NextResponse.json({ holdings: transformedHoldings });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, type, amount, return1m, color } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }
  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than 0" },
      { status: 400 },
    );
  }

  await connectDB();

  const holding = await Holding.create({
    userId: new mongoose.Types.ObjectId(session.sub),
    name: name.trim(),
    type,
    amount,
    return1m: return1m || 0,
    color: color || "199 89% 60%",
  });

  return NextResponse.json(
    {
      holding: {
        id: holding._id.toString(),
        user_id: holding.userId.toString(),
        name: holding.name,
        type: holding.type,
        amount: holding.amount,
        return1m: holding.return1m,
        color: holding.color,
        created_at: holding.createdAt.toISOString(),
        updated_at: holding.updatedAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
