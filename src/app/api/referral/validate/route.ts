import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Referral } from "@/lib/models/Referral";
import { Profile } from "@/lib/models/Profile";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    await connectDB();

    const referral = await Referral.findOne({
      code: code.toUpperCase(),
    }).lean();

    if (!referral) {
      return NextResponse.json(
        { valid: false, error: "Invalid referral code" },
        { status: 404 },
      );
    }

    // Get referrer name from profile
    const profile = await Profile.findOne({ userId: referral.userId }).lean();
    const referrerName = profile?.displayName || "a friend";

    return NextResponse.json({
      valid: true,
      code: referral.code,
      referrerName,
      rewardAmount: referral.rewardPerSignup,
    });
  } catch (error) {
    console.error("Error validating referral:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
