import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { Wallet } from "@/lib/models/Wallet";
import { Reward } from "@/lib/models/Gamification";
import { UserSettings } from "@/lib/models/UserSettings";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectDB();

  const [user, profile, wallet, reward] = await Promise.all([
    User.findById(session.sub).lean(),
    Profile.findOne({ userId: session.sub }).lean(),
    Wallet.findOne({ userId: session.sub }).lean(),
    Reward.findOne({ userId: session.sub }).lean(),
  ]);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const joinedDays = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  const initial = user.displayName?.charAt(0).toUpperCase() ?? "?";

  const points = reward?.points ?? 0;
  const badge =
    points >= 5000
      ? "Saver Tier 4"
      : points >= 2000
        ? "Saver Tier 3"
        : points >= 500
          ? "Saver Tier 2"
          : "Saver Tier 1";

  const streak = reward?.streakDays ?? 0;
  const balance = wallet?.balance ?? 0;
  const healthScore = Math.min(
    100,
    Math.round(
      40 +
        (streak > 0 ? Math.min(streak * 0.5, 20) : 0) +
        (balance > 1000 ? 20 : balance > 0 ? 10 : 0) +
        (points > 100 ? 10 : 0) +
        (reward?.badges?.length ?? 0) * 2,
    ),
  );

  const settings = await UserSettings.findOne({ userId: session.sub }).lean();

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.displayName,
      initial,
      phone: profile?.phone ?? null,
      avatarEmoji: profile?.avatarEmoji ?? "🦋",
      notificationsEnabled: profile?.notificationsEnabled ?? true,
      joinedDays,
      streak,
      badge,
      healthScore,
      currentBalance: balance,
      totalInvested: 0,
      pendingRoundUps: 0,
      roundUpMode: settings?.roundUpMode || "Medium",
      frozen: wallet?.frozen ?? false,
      dailyLimit: wallet?.dailyLimit ?? 3000,
      monthlyLimit: wallet?.monthlyLimit ?? 10000,
      perTransactionLimit: wallet?.perTransactionLimit ?? 1500,
      onlineEnabled: wallet?.onlineEnabled ?? true,
      contactlessEnabled: wallet?.contactlessEnabled ?? true,
      internationalEnabled: wallet?.internationalEnabled ?? false,
      atmEnabled: wallet?.atmEnabled ?? true,
      points,
      level: reward?.level ?? 1,
      badges: reward?.badges ?? [],
      customRoundUpAmount: settings?.customRoundUpAmount || 10,
    },
  });
}
