"use client";

import { useProfile } from "@/hooks/useProfile";
import { useWallet } from "@/hooks/useWallet";
import { useTransactions } from "@/hooks/useTransactions";
import { useUserSettings } from "@/hooks/useUserSettings";
import DashboardHeader from "@/features/dashboard/DashboardHeader";
import BalanceCard from "@/features/dashboard/BalanceCard";
import HealthScoreCard from "@/features/dashboard/HealthScoreCard";
import StreakCard from "@/features/dashboard/StreakCard";
import RoundUpModeSelector from "@/features/dashboard/RoundUpModeSelector";
import GeminiBanner from "@/features/dashboard/GeminiBanner";
import RecentActivity from "@/features/dashboard/RecentActivity";

const calculateStreak = (joinDate?: string) => {
  if (!joinDate) return 0;
  const joined = new Date(joinDate);
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.min(diffDays, Math.floor(diffDays * 0.8));
};

const Dashboard = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { wallet, transfers, loading: walletLoading } = useWallet();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const {
    settings,
    updateSettings,
    loading: settingsLoading,
  } = useUserSettings();

  const mode =
    (settings?.roundUpMode as "None" | "Normal" | "Medium" | "Aggressive") ||
    "None";

  const handleModeChange = async (
    newMode: "None" | "Normal" | "Medium" | "Aggressive",
  ) => {
    await updateSettings({ roundUpMode: newMode });
  };

  const totalInvested =
    transfers
      ?.filter((t) => t.type === "deposit" || t.type === "topup")
      .reduce((sum: number, t) => sum + t.amount, 0) || 0;

  const pendingRoundUps =
    transactions
      ?.filter((t) => t.status === "Pending")
      .reduce((sum: number, t) => sum + t.roundUp, 0) || 0;

  const liveBalance = wallet?.balance || 0;
  const streakVal = calculateStreak(profile?.created_at);

  const healthScore = Math.min(
    100,
    Math.round(
      40 +
        (streakVal > 0 ? Math.min(streakVal * 0.5, 20) : 0) +
        (liveBalance > 1000 ? 20 : liveBalance > 0 ? 10 : 0) +
        (totalInvested > 100 ? 10 : 0),
    ),
  );

  const badgeLevel =
    healthScore >= 5000
      ? "Saver_Tier_4"
      : healthScore >= 2000
        ? "Saver_Tier_3"
        : healthScore >= 500
          ? "Saver_Tier_2"
          : "Saver_Tier_1";

  const isLoading =
    profileLoading || walletLoading || transactionsLoading || settingsLoading;
  const recentTransactions = transactions?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-8 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
        <div className="flex gap-3">
          <div className="h-28 flex-1 animate-pulse rounded-2xl bg-muted" />
          <div className="h-28 flex-1 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        displayName={profile?.display_name || "there"}
        avatarEmoji={profile?.avatar_emoji}
        initial={profile?.display_name?.[0]?.toUpperCase() || "U"}
      />

      <BalanceCard
        balance={liveBalance}
        totalInvested={totalInvested}
        pendingRoundUps={pendingRoundUps}
      />

      <div className="grid grid-cols-2 gap-3">
        <HealthScoreCard score={healthScore} />
        <StreakCard streak={streakVal} badge={badgeLevel} />
      </div>

      <RoundUpModeSelector mode={mode} onModeChange={handleModeChange} />

      <GeminiBanner />

      <RecentActivity transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;
