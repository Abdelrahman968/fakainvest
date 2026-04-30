import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Goal } from "@/lib/models/Goal";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const goals = await Goal.find({
      userId: new mongoose.Types.ObjectId(session.sub),
    })
      .sort({ createdAt: -1 })
      .lean();

    const transformedGoals = goals.map((goal) => {
      const savedAmount = goal.savedAmount || 0;
      const targetAmount = goal.targetAmount;
      const progress =
        targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
      const remaining = Math.max(0, targetAmount - savedAmount);

      let dailyRequired = null;
      if (goal.deadline) {
        const today = new Date();
        const deadline = new Date(goal.deadline);
        const daysLeft = Math.max(
          1,
          Math.ceil(
            (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          ),
        );
        dailyRequired = Math.ceil(remaining / daysLeft);
      }

      return {
        id: goal._id.toString(),
        user_id: goal.userId.toString(),
        title: goal.title,
        emoji: goal.emoji,
        category: goal.category,
        target: goal.targetAmount,
        saved: goal.savedAmount,
        deadline: goal.deadline
          ? goal.deadline.toISOString().split("T")[0]
          : null,
        color: goal.color,
        created_at: goal.createdAt.toISOString(),
        updated_at: goal.updatedAt.toISOString(),
        progress: Math.min(100, Math.round(progress * 10) / 10),
        remaining: remaining,
        dailyRequired: dailyRequired,
      };
    });

    return NextResponse.json({ goals: transformedGoals });
  } catch (error) {
    console.error("Error in GET goals:", error);
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
    console.log("Received body:", body);

    const title = body.title;
    const emoji = body.emoji;
    const category = body.category;
    const targetAmount = body.targetAmount || body.target;
    const deadline = body.deadline;
    const color = body.color;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!targetAmount || targetAmount <= 0) {
      console.log("Invalid targetAmount:", targetAmount);
      return NextResponse.json(
        { error: "Target amount must be greater than 0" },
        { status: 400 },
      );
    }

    if (targetAmount > 10000000) {
      return NextResponse.json(
        { error: "Target amount cannot exceed 10,000,000 EGP" },
        { status: 400 },
      );
    }

    await connectDB();

    const goal = await Goal.create({
      userId: new mongoose.Types.ObjectId(session.sub),
      title: title.trim(),
      emoji: emoji || "🎯",
      category: category || "Other",
      targetAmount: targetAmount,
      savedAmount: 0,
      deadline: deadline ? new Date(deadline) : null,
      color: color || "199 89% 60%",
    });

    const savedAmount = goal.savedAmount || 0;
    const progress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
    const remaining = Math.max(0, targetAmount - savedAmount);

    let dailyRequired = null;
    if (goal.deadline) {
      const today = new Date();
      const deadlineDate = new Date(goal.deadline);
      const daysLeft = Math.max(
        1,
        Math.ceil(
          (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );
      dailyRequired = Math.ceil(remaining / daysLeft);
    }

    return NextResponse.json(
      {
        goal: {
          id: goal._id.toString(),
          user_id: goal.userId.toString(),
          title: goal.title,
          emoji: goal.emoji,
          category: goal.category,
          target: goal.targetAmount,
          saved: goal.savedAmount,
          deadline: goal.deadline
            ? goal.deadline.toISOString().split("T")[0]
            : null,
          color: goal.color,
          created_at: goal.createdAt.toISOString(),
          updated_at: goal.updatedAt.toISOString(),
          progress: Math.min(100, Math.round(progress * 10) / 10),
          remaining: remaining,
          dailyRequired: dailyRequired,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
