import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Referral, ReferralSignup } from "@/lib/models/Referral";
import mongoose from "mongoose";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.sub);

    let referral = await Referral.findOne({ userId }).lean();

    // Create referral if not exists
    if (!referral) {
      const code = randomBytes(4).toString("hex").toUpperCase();
      referral = await Referral.create({
        userId,
        code,
        totalEarned: 0,
        rewardPerSignup: 50,
      });
    }

    const signups = await ReferralSignup.find({ referrerId: userId })
      .sort({ joinedAt: -1 })
      .lean();

    const transformedSignups = signups.map((s) => ({
      id: s._id.toString(),
      user_id: s.referrerId.toString(),
      name: s.name,
      avatar: s.avatar,
      status: s.status,
      earned: s.earned,
      joined_at: s.joinedAt.toISOString().split("T")[0],
    }));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/r/${referral.code}`;

    return NextResponse.json({
      referral: {
        user_id: referral.userId.toString(),
        code: referral.code,
        total_earned: referral.totalEarned,
        reward_per_signup: referral.rewardPerSignup,
      },
      signups: transformedSignups,
      link,
    });
  } catch (error) {
    console.error("Error fetching referral data:", error);
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
    const { type, code, referredUserName, referredUserEmail } = body;

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.sub);

    if (type === "trackReferral") {
      const referral = await Referral.findOne({ code });
      if (!referral) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 404 },
        );
      }

      const signup = await ReferralSignup.create({
        referralId: referral._id,
        referrerId: referral.userId,
        name: referredUserName || "New User",
        avatar: "👤",
        status: "Pending",
        earned: 0,
        joinedAt: new Date(),
      });

      return NextResponse.json({ success: true, signup });
    }

    if (type === "activateReferral") {
      const { signupId } = body;

      const signup = await ReferralSignup.findById(signupId);
      if (!signup) {
        return NextResponse.json(
          { error: "Signup not found" },
          { status: 404 },
        );
      }

      signup.status = "Active";
      signup.earned = 50;
      await signup.save();

      const referral = await Referral.findById(signup.referralId);
      if (referral) {
        referral.totalEarned += 50;
        await referral.save();
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in referral API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
