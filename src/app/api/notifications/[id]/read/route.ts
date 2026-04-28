import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Notification } from "@/lib/models/Notification";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 },
      );
    }

    const result = await Notification.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(session.sub),
      },
      { $set: { readAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Notification not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      readAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return POST(request, { params });
}
