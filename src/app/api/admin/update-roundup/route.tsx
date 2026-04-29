import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { UserSettings } from "@/lib/models/UserSettings";

export async function POST() {
  try {
    await connectDB();

    const result = await UserSettings.updateMany(
      { customRoundUpAmount: { $exists: false } },
      { $set: { customRoundUpAmount: 10 } },
    );

    return NextResponse.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
