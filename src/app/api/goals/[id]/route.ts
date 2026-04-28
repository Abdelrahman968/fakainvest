import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Goal, GoalContribution } from "@/lib/models/Goal";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
  }

  await connectDB();

  const goal = await Goal.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  }).lean();

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const savedAmount = goal.savedAmount || 0;
  const targetAmount = goal.targetAmount;
  const progress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
  const remaining = Math.max(0, targetAmount - savedAmount);

  let dailyRequired = null;
  if (goal.deadline) {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysLeft = Math.max(1, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    dailyRequired = Math.ceil(remaining / daysLeft);
  }

  return NextResponse.json({
    goal: {
      id: goal._id.toString(),
      user_id: goal.userId.toString(),
      title: goal.title,
      emoji: goal.emoji,
      category: goal.category,
      target: goal.targetAmount,
      saved: goal.savedAmount,
      deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : null,
      color: goal.color,
      created_at: goal.createdAt.toISOString(),
      updated_at: goal.updatedAt.toISOString(),
      progress: Math.min(100, Math.round(progress * 10) / 10),
      remaining: remaining,
      dailyRequired: dailyRequired,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
  }

  const body = await request.json();
  const { title, emoji, category, targetAmount, deadline, color } = body;

  await connectDB();

  const goal = await Goal.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  if (title !== undefined) goal.title = title.trim();
  if (emoji !== undefined) goal.emoji = emoji;
  if (category !== undefined) goal.category = category;
  if (targetAmount !== undefined) {
    if (targetAmount <= 0) {
      return NextResponse.json({ error: "Target amount must be greater than 0" }, { status: 400 });
    }
    goal.targetAmount = targetAmount;
  }
  if (deadline !== undefined) goal.deadline = deadline ? new Date(deadline) : null;
  if (color !== undefined) goal.color = color;

  await goal.save();

  const savedAmount = goal.savedAmount || 0;
  const progress = goal.targetAmount > 0 ? (savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, goal.targetAmount - savedAmount);

  let dailyRequired = null;
  if (goal.deadline) {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysLeft = Math.max(1, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    dailyRequired = Math.ceil(remaining / daysLeft);
  }

  return NextResponse.json({
    goal: {
      id: goal._id.toString(),
      user_id: goal.userId.toString(),
      title: goal.title,
      emoji: goal.emoji,
      category: goal.category,
      target: goal.targetAmount,
      saved: goal.savedAmount,
      deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : null,
      color: goal.color,
      created_at: goal.createdAt.toISOString(),
      updated_at: goal.updatedAt.toISOString(),
      progress: Math.min(100, Math.round(progress * 10) / 10),
      remaining: remaining,
      dailyRequired: dailyRequired,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
  }

  await connectDB();

  const goal = await Goal.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  await GoalContribution.deleteMany({
    goalId: new mongoose.Types.ObjectId(id),
  });
  
  await goal.deleteOne();

  return NextResponse.json({ success: true });
}