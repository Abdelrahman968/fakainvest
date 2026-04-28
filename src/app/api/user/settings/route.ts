import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { UserSettings } from "@/lib/models/UserSettings";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const settings = await UserSettings.findOne({ userId: session.sub }).lean();
  
  return NextResponse.json({
    roundUpMode: settings?.roundUpMode || "Medium",
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { roundUpMode } = body;

  await connectDB();

  const settings = await UserSettings.findOneAndUpdate(
    { userId: session.sub },
    { roundUpMode, updatedAt: new Date() },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ roundUpMode: settings?.roundUpMode });
}