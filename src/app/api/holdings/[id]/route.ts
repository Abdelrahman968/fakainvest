import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Holding } from "@/lib/models/Holding";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid holding ID" }, { status: 400 });
  }

  await connectDB();

  const holding = await Holding.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  }).lean();

  if (!holding) {
    return NextResponse.json({ error: "Holding not found" }, { status: 404 });
  }

  return NextResponse.json({
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
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid holding ID" }, { status: 400 });
  }

  const body = await request.json();
  const { name, type, amount, return1m, color } = body;

  await connectDB();

  const holding = await Holding.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!holding) {
    return NextResponse.json({ error: "Holding not found" }, { status: 404 });
  }

  if (name !== undefined) holding.name = name.trim();
  if (type !== undefined) holding.type = type;
  if (amount !== undefined) {
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }
    holding.amount = amount;
  }
  if (return1m !== undefined) holding.return1m = return1m;
  if (color !== undefined) holding.color = color;

  await holding.save();

  return NextResponse.json({
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
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid holding ID" }, { status: 400 });
  }

  await connectDB();

  const holding = await Holding.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!holding) {
    return NextResponse.json({ error: "Holding not found" }, { status: 404 });
  }

  await holding.deleteOne();

  return NextResponse.json({ success: true });
}
