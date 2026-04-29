import { NextResponse } from "next/server";
import { getSession, signToken, cookieOptions, TOKEN_COOKIE } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Profile } from "@/lib/models/Profile";
import { User } from "@/lib/models/User";
import { z } from "zod";
import { cookies } from "next/headers";

const updateSchema = z.object({
  display_name: z.string().min(2).max(40).optional(),
  email: z.string().email().max(80).optional(),
  phone: z
    .string()
    .regex(/^[+\d\s()-]{6,20}$/)
    .optional(),
  avatar_icon: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const profile = await Profile.findOne({ userId: session.sub }).lean();
  if (!profile) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({
    profile: {
      id: profile._id.toString(),
      display_name: profile.displayName,
      email: profile.email,
      phone: profile.phone,
      avatar_icon: profile.avatarEmoji,
      notifications_enabled: profile.notificationsEnabled,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  await connectDB();

  const currentProfile = await Profile.findOne({ userId: session.sub }).lean();

  if (!currentProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  let emailChanged = false;
  let newEmail = parsed.data.email;

  if (
    parsed.data.email !== undefined &&
    parsed.data.email !== currentProfile.email
  ) {
    emailChanged = true;

    const existingUser = await User.findOne({
      email: parsed.data.email,
      _id: { $ne: session.sub },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم من قبل حساب آخر" },
        { status: 409 },
      );
    }
  }

  const profileUpdateData: Record<string, unknown> = {};
  if (parsed.data.display_name !== undefined)
    profileUpdateData.displayName = parsed.data.display_name;
  if (parsed.data.email !== undefined)
    profileUpdateData.email = parsed.data.email;
  if (parsed.data.phone !== undefined)
    profileUpdateData.phone = parsed.data.phone;
  if (parsed.data.avatar_icon !== undefined)
    profileUpdateData.avatarEmoji = parsed.data.avatar_icon;
  if (parsed.data.notifications_enabled !== undefined)
    profileUpdateData.notificationsEnabled = parsed.data.notifications_enabled;

  const updatedProfile = await Profile.findOneAndUpdate(
    { userId: session.sub },
    { $set: profileUpdateData },
    { new: true },
  ).lean();

  let newToken = null;

  if (emailChanged && newEmail) {
    const updatedUser = await User.findByIdAndUpdate(
      session.sub,
      { $set: { email: newEmail } },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    newToken = await signToken({
      sub: updatedUser._id.toString(),
      email: updatedUser.email,
      displayName: updatedUser.displayName,
    });

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE, newToken, cookieOptions);
  }

  return NextResponse.json({
    profile: {
      id: updatedProfile?._id.toString(),
      display_name: updatedProfile?.displayName,
      email: updatedProfile?.email,
      phone: updatedProfile?.phone,
      avatar_icon: updatedProfile?.avatarEmoji,
      notifications_enabled: updatedProfile?.notificationsEnabled,
    },
    emailChanged,
  });
}
