import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Rule } from "@/lib/models/Rule";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const rules = await Rule.find({
      userId: new mongoose.Types.ObjectId(session.sub),
    }).sort({ createdAt: 1 });

    const transformedRules = rules.map((rule) => ({
      id: rule._id.toString(),
      user_id: rule.userId.toString(),
      trigger_text: rule.triggerText,
      trigger_emoji: rule.triggerEmoji,
      action_text: rule.actionText,
      action_emoji: rule.actionEmoji,
      enabled: rule.enabled,
      triggered_count: rule.triggeredCount,
      created_at: rule.createdAt.toISOString(),
      updated_at: rule.updatedAt.toISOString(),
    }));

    return NextResponse.json({ rules: transformedRules });
  } catch (error) {
    console.error("Error fetching rules:", error);
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
    const { triggerText, actionText, triggerEmoji, actionEmoji } = body;

    if (!triggerText?.trim()) {
      return NextResponse.json(
        { error: "Trigger text is required" },
        { status: 400 },
      );
    }

    if (!actionText?.trim()) {
      return NextResponse.json(
        { error: "Action text is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const rule = await Rule.create({
      userId: new mongoose.Types.ObjectId(session.sub),
      triggerText: triggerText.trim(),
      triggerEmoji: triggerEmoji || "⚡",
      actionText: actionText.trim(),
      actionEmoji: actionEmoji || "✨",
      enabled: true,
      triggeredCount: 0,
    });

    return NextResponse.json(
      {
        rule: {
          id: rule._id.toString(),
          user_id: rule.userId.toString(),
          trigger_text: rule.triggerText,
          trigger_emoji: rule.triggerEmoji,
          action_text: rule.actionText,
          action_emoji: rule.actionEmoji,
          enabled: rule.enabled,
          triggered_count: rule.triggeredCount,
          created_at: rule.createdAt.toISOString(),
          updated_at: rule.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
