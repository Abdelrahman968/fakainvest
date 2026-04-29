"use client";

import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useWallet } from "@/hooks/useWallet";
import { useTransactions } from "@/hooks/useTransactions";
import { useUserSettings, type RoundUpMode } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";
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

const getMockPendingRoundUps = (
  mode: string,
  customAmount: number = 10,
): number => {
  switch (mode) {
    case "Eco":
      return 5;
    case "Boost":
      return 10;
    case "Fixed20":
      return 20;
    case "Custom":
      return customAmount;
    case "None":
      return 0;
    default:
      return 5;
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { wallet, transfers, loading: walletLoading } = useWallet();
  const {
    transactions,
    loading: transactionsLoading,
    pendingRoundUps: realPendingRoundUps,
  } = useTransactions();
  const {
    settings,
    updateSettings,
    loading: settingsLoading,
  } = useUserSettings();

  const mode = (settings?.roundUpMode as RoundUpMode) || "Boost";
  const customRoundUpAmount = settings?.customRoundUpAmount ?? 10;
  const roundUpEnabled = settings?.roundUpEnabled ?? true;

  const pendingRoundUps = useMemo(() => {
    if (realPendingRoundUps > 0) {
      return realPendingRoundUps;
    }
    if (mode === "None" || !roundUpEnabled) {
      return 0;
    }
    return getMockPendingRoundUps(mode, customRoundUpAmount);
  }, [realPendingRoundUps, mode, roundUpEnabled, customRoundUpAmount]);

  const handleModeChange = async (
    newMode: RoundUpMode,
    customAmount?: number,
  ) => {
    const updateData: any = { roundUpMode: newMode };

    if (newMode === "Custom" && customAmount !== undefined) {
      updateData.customRoundUpAmount = customAmount;
    }

    if (newMode === "None") {
      updateData.roundUpEnabled = false;
    } else if (roundUpEnabled === false) {
      updateData.roundUpEnabled = true;
    }

    await updateSettings(updateData);
  };

  const handleEnabledChange = async (enabled: boolean) => {
    if (!enabled) {
      await updateSettings({
        roundUpEnabled: false,
        roundUpMode: "None",
      });
    } else {
      const newMode = mode === "None" ? "Eco" : mode;
      await updateSettings({
        roundUpEnabled: true,
        roundUpMode: newMode,
      });
    }
  };

  const totalInvested =
    transfers
      ?.filter((t) => t.type === "deposit" || t.type === "topup")
      .reduce((sum: number, t) => sum + t.amount, 0) || 0;

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
        displayName={profile?.display_name || user?.displayName || "there"}
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

      <RoundUpModeSelector
        mode={mode}
        customAmount={customRoundUpAmount}
        enabled={roundUpEnabled}
        onModeChange={handleModeChange}
        onEnabledChange={handleEnabledChange}
        pendingAmount={pendingRoundUps}
      />

      <GeminiBanner />

      <RecentActivity transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;
