import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Goal, GoalContribution } from "@/lib/models/Goal";
import mongoose from "mongoose";

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
    return NextResponse.json({ error: "Invalid contribution ID" }, { status: 400 });
  }

  await connectDB();

  const contribution = await GoalContribution.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (!contribution) {
    return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
  }

  const goal = await Goal.findOne({
    _id: contribution.goalId,
    userId: new mongoose.Types.ObjectId(session.sub),
  });

  if (goal) {
    goal.savedAmount = Math.max(0, (goal.savedAmount || 0) - contribution.amount);
    await goal.save();
  }

  await contribution.deleteOne();

  return NextResponse.json({ success: true });
}