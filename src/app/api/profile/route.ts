import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Profile } from "@/lib/models/Profile";
import { z } from "zod";


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
      avatar_emoji: profile.avatarEmoji,
      notifications_enabled: profile.notificationsEnabled,
    },
  });
}


const updateSchema = z.object({
  display_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar_emoji: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
});

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.display_name !== undefined) updateData.displayName = parsed.data.display_name;
  if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone;
  if (parsed.data.avatar_emoji !== undefined) updateData.avatarEmoji = parsed.data.avatar_emoji;
  if (parsed.data.notifications_enabled !== undefined) updateData.notificationsEnabled = parsed.data.notifications_enabled;

  const profile = await Profile.findOneAndUpdate(
    { userId: session.sub },
    { $set: updateData },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({
    profile: {
      id: profile._id.toString(),
      display_name: profile.displayName,
      email: profile.email,
      phone: profile.phone,
      avatar_emoji: profile.avatarEmoji,
      notifications_enabled: profile.notificationsEnabled,
    },
  });
}