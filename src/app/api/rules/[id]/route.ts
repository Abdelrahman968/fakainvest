import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Rule } from "@/lib/models/Rule";
import mongoose from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid rule ID" }, { status: 400 });
    }

    const body = await request.json();
    const { enabled, triggerText, actionText, triggerEmoji, actionEmoji } =
      body;

    await connectDB();

    const rule = await Rule.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.sub),
    });

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    if (enabled !== undefined) rule.enabled = enabled;
    if (triggerText !== undefined) rule.triggerText = triggerText.trim();
    if (actionText !== undefined) rule.actionText = actionText.trim();
    if (triggerEmoji !== undefined) rule.triggerEmoji = triggerEmoji;
    if (actionEmoji !== undefined) rule.actionEmoji = actionEmoji;

    await rule.save();

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error updating rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid rule ID" }, { status: 400 });
    }

    await connectDB();

    const rule = await Rule.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.sub),
    });

    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    await rule.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting rule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
