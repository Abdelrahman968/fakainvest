import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Goal, GoalContribution } from "@/lib/models/Goal";
import mongoose from "mongoose";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get("goalId");

  await connectDB();

  const query: {
    userId: mongoose.Types.ObjectId;
    goalId?: mongoose.Types.ObjectId;
  } = {
    userId: new mongoose.Types.ObjectId(session.sub),
  };
  
  if (goalId && mongoose.Types.ObjectId.isValid(goalId)) {
    query.goalId = new mongoose.Types.ObjectId(goalId);
  } else if (goalId) {
    return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
  }

  const contributions = await GoalContribution.find(query)
    .sort({ createdAt: -1 })
    .populate("goalId", "title emoji color")
    .lean();

  interface PopulatedContribution {
    _id: mongoose.Types.ObjectId;
    goalId: {
      _id: mongoose.Types.ObjectId;
      title: string;
      emoji: string;
      color: string;
    };
    userId: mongoose.Types.ObjectId;
    amount: number;
    note: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const transformedContributions = (contributions as unknown as PopulatedContribution[]).map((contribution) => ({
    id: contribution._id.toString(),
    goal_id: contribution.goalId._id.toString(),
    user_id: contribution.userId.toString(),
    amount: contribution.amount,
    note: contribution.note || null,
    goal_title: contribution.goalId.title,
    goal_emoji: contribution.goalId.emoji,
    goal_color: contribution.goalId.color,
    created_at: contribution.createdAt.toISOString(),
    updated_at: contribution.updatedAt.toISOString(),
  }));

  return NextResponse.json({ contributions: transformedContributions });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { goalId, amount, note } = body;

  if (!goalId || !mongoose.Types.ObjectId.isValid(goalId)) {
    return NextResponse.json({ error: "Valid goal ID is required" }, { status: 400 });
  }
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
  }

  await connectDB();

  const goal = await Goal.findOne({
    _id: new mongoose.Types.ObjectId(goalId),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const newSavedAmount = (goal.savedAmount || 0) + amount;
  if (newSavedAmount > goal.targetAmount) {
    const maxAllowed = goal.targetAmount - (goal.savedAmount || 0);
    return NextResponse.json({
      error: `Amount would exceed target. Maximum allowed: ${maxAllowed}`,
      maxAllowed,
    }, { status: 400 });
  }

  const contribution = await GoalContribution.create({
    goalId: new mongoose.Types.ObjectId(goalId),
    userId: new mongoose.Types.ObjectId(session.sub),
    amount,
    note: note?.trim() || "",
  });

  goal.savedAmount = newSavedAmount;
  await goal.save();

  return NextResponse.json({
    contribution: {
      id: contribution._id.toString(),
      goal_id: contribution.goalId.toString(),
      user_id: contribution.userId.toString(),
      amount: contribution.amount,
      note: contribution.note || null,
      created_at: contribution.createdAt.toISOString(),
      updated_at: contribution.updatedAt.toISOString(),
    },
  }, { status: 201 });
}