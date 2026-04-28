import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Notification } from "@/lib/models/Notification";
import mongoose from "mongoose";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const result = await Notification.updateMany(
      {
        userId: new mongoose.Types.ObjectId(session.sub),
        readAt: null,
      },
      { $set: { readAt: now } },
    );

    return NextResponse.json({
      success: true,
      readAt: now.toISOString(),
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
