import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Notification } from "@/lib/models/Notification";
import mongoose from "mongoose";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const notifications = await Notification.find({
    userId: new mongoose.Types.ObjectId(session.sub),
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n._id.toString(),
      user_id: n.userId.toString(),
      title: n.title,
      body: n.body,
      emoji: n.emoji,
      type: n.type,
      readAt: n.readAt ? n.readAt.toISOString() : null,
      created_at: n.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, body: notificationBody, emoji, type } = body;

  await connectDB();

  const notification = await Notification.create({
    userId: new mongoose.Types.ObjectId(session.sub),
    title,
    body: notificationBody,
    emoji: emoji || "🔔",
    type: type || "alert",
  });

  return NextResponse.json({
    notification: {
      id: notification._id.toString(),
      user_id: notification.userId.toString(),
      title: notification.title,
      body: notification.body,
      emoji: notification.emoji,
      type: notification.type,
      readAt: null,
      created_at: notification.createdAt.toISOString(),
    },
  });
}
