import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Goal, GoalContribution } from "@/lib/models/Goal";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, amount } = body;

    if (!goalId || !mongoose.Types.ObjectId.isValid(goalId)) {
      return NextResponse.json(
        { error: "Valid goal ID is required" },
        { status: 400 },
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    await connectDB();

    const goal = await Goal.findOne({
      _id: new mongoose.Types.ObjectId(goalId),
      userId: new mongoose.Types.ObjectId(session.sub),
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const currentSaved = goal.savedAmount || 0;
    const newSavedAmount = currentSaved + amount;

    if (newSavedAmount > goal.targetAmount) {
      const maxAllowed = goal.targetAmount - currentSaved;
      return NextResponse.json(
        {
          error: `Amount would exceed target. Maximum allowed: ${maxAllowed} EGP`,
          maxAllowed,
        },
        { status: 400 },
      );
    }

    const contribution = await GoalContribution.create({
      goalId: new mongoose.Types.ObjectId(goalId),
      userId: new mongoose.Types.ObjectId(session.sub),
      amount,
      note: "",
    });

    // Update goal with manual validation
    goal.savedAmount = Math.min(newSavedAmount, goal.targetAmount);
    await goal.save();

    return NextResponse.json({
      success: true,
      contribution: {
        id: contribution._id.toString(),
        goal_id: contribution.goalId.toString(),
        user_id: contribution.userId.toString(),
        amount: contribution.amount,
        note: contribution.note || null,
        created_at: contribution.createdAt.toISOString(),
        updated_at: contribution.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in contribute API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
