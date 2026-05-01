import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/validators";
import { signToken, cookieOptions, TOKEN_COOKIE } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { seedNewUser } from "@/lib/seed";
import { Referral, ReferralSignup } from "@/lib/models/Referral";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referralCode } = body;

    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { displayName, email, password } = parsed.data;

    await connectDB();

    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) {
      return NextResponse.json(
        { error: "This email is already registered. Try signing in instead." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ displayName, email, passwordHash });

    // Handle referral if code exists
    let referredBy = null;
    if (referralCode) {
      const referral = await Referral.findOne({
        code: referralCode.toUpperCase(),
      }).lean();
      if (referral) {
        referredBy = referral.userId;

        // Create referral signup record
        await ReferralSignup.create({
          referralId: referral._id,
          referrerId: referral.userId,
          name: displayName,
          avatar: "👤",
          status: "Pending",
          earned: 0,
          joinedAt: new Date(),
        });
      }
    }

    await seedNewUser(user._id, displayName, email);

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          displayName: user.displayName,
        },
      },
      { status: 201 },
    );

    response.cookies.set(TOKEN_COOKIE, token, cookieOptions);
    return response;
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
