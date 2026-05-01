"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Reward = {
  _id: string;
  userId: string;
  points: number;
  level: number;
  streakDays: number;
  badges: string[];
  completedChallenges: string[];
};

export type Challenge = {
  _id: string;
  title: string;
  emoji: string;
  description: string;
  reward: string;
  rewardPoints: number;
  target: number;
  durationDays: number;
  participants: number;
  isActive: boolean;
};

export type Badge = {
  _id: string;
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  condition: string;
  requiredValue: number;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  isYou: boolean;
};

export const useRewards = () => {
  const { user } = useAuth();
  const [reward, setReward] = useState<Reward | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rewards");
      if (!res.ok) {
        throw new Error("Failed to fetch rewards data");
      }
      const data = await res.json();
      setReward(data.reward);
      setChallenges(data.challenges || []);
      setBadges(data.badges || []);
      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank || null);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to load rewards data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const joinChallenge = useCallback(
    async (challengeId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const res = await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "joinChallenge", challengeId }),
        });
        const data = await res.json();
        if (res.ok) {
          await refresh();
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error joining challenge:", err);
        return false;
      }
    },
    [user, refresh],
  );

  const updateStreak = useCallback(async (): Promise<number> => {
    if (!user) return 0;

    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "updateStreak" }),
      });
      const data = await res.json();
      if (res.ok && data.streakDays) {
        setReward((prev) =>
          prev ? { ...prev, streakDays: data.streakDays } : prev,
        );
        return data.streakDays;
      }
      return 0;
    } catch (err) {
      console.error("Error updating streak:", err);
      return 0;
    }
  }, [user]);

  return {
    reward,
    challenges,
    badges,
    leaderboard,
    userRank,
    loading,
    error,
    refresh,
    joinChallenge,
    updateStreak,
  };
};
