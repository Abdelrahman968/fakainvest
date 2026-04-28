"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type GoalCategory =
  | "Travel"
  | "Apartment"
  | "Device"
  | "Education"
  | "Other";

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  category: GoalCategory;
  target: number;
  saved: number;
  deadline: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  progress: number;
  remaining: number;
  dailyRequired: number | null;
};

export type GoalContribution = {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  note: string | null;
  goal_title?: string;
  goal_emoji?: string;
  goal_color?: string;
  created_at: string;
  updated_at: string;
};

export type CreateGoalInput = {
  title: string;
  emoji?: string;
  category?: GoalCategory;
  targetAmount: number;
  savedAmount?: number;
  deadline?: string;
  color?: string;
};

export type AddContributionInput = {
  goalId: string;
  amount: number;
  note?: string;
};

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const isInitialMount = useRef(true);

  const refreshGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error("[useGoals] Error fetching goals:", err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshContributions = useCallback(
    async (goalId?: string) => {
      if (!user) return;

      try {
        const url = goalId
          ? `/api/goals/contributions?goalId=${goalId}`
          : "/api/goals/contributions";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setContributions(data.contributions || []);
        }
      } catch (err) {
        console.error("[useGoals] Error fetching contributions:", err);
      }
    },
    [user],
  );

  const fetchGoalById = useCallback(
    async (goalId: string) => {
      if (!user) return null;

      try {
        const res = await fetch(`/api/goals/${goalId}`);
        if (res.ok) {
          const data = await res.json();
          return data.goal;
        }
      } catch (err) {
        console.error("[useGoals] Error fetching goal:", err);
      }
      return null;
    },
    [user],
  );

  const createGoal = useCallback(
    async (
      input: CreateGoalInput,
    ): Promise<{ ok: true; goal: Goal } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not authenticated" };
      if (!input.title?.trim())
        return { ok: false, reason: "Title is required" };
      if (!input.targetAmount || input.targetAmount <= 0) {
        return { ok: false, reason: "Target amount must be greater than 0" };
      }

      try {
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, reason: data.error || "Failed to create goal" };
        }
        await refreshGoals();
        return { ok: true, goal: data.goal };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshGoals],
  );

  const updateGoal = useCallback(
    async (
      goalId: string,
      updates: Partial<Omit<CreateGoalInput, "savedAmount">>,
    ): Promise<{ ok: true; goal: Goal } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not authenticated" };

      try {
        const res = await fetch(`/api/goals/${goalId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, reason: data.error || "Failed to update goal" };
        }
        await refreshGoals();
        return { ok: true, goal: data.goal };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshGoals],
  );

  const deleteGoal = useCallback(
    async (
      goalId: string,
    ): Promise<{ ok: true } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not authenticated" };

      try {
        const res = await fetch(`/api/goals/${goalId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          return { ok: false, reason: data.error || "Failed to delete goal" };
        }
        await refreshGoals();
        if (selectedGoal?.id === goalId) setSelectedGoal(null);
        return { ok: true };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshGoals, selectedGoal],
  );

  const addContribution = useCallback(
    async (
      input: AddContributionInput,
    ): Promise<
      | { ok: true; contribution: GoalContribution }
      | { ok: false; reason: string }
    > => {
      if (!user) return { ok: false, reason: "Not authenticated" };
      if (!input.goalId) return { ok: false, reason: "Goal ID is required" };
      if (!input.amount || input.amount <= 0) {
        return { ok: false, reason: "Amount must be greater than 0" };
      }

      try {
        const res = await fetch("/api/goals/contributions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            reason: data.error || "Failed to add contribution",
          };
        }
        await refreshGoals();
        await refreshContributions(input.goalId);
        return { ok: true, contribution: data.contribution };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshGoals, refreshContributions],
  );

  const deleteContribution = useCallback(
    async (
      contributionId: string,
      goalId: string,
    ): Promise<{ ok: true } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not authenticated" };

      try {
        const res = await fetch(`/api/goals/contributions/${contributionId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          return {
            ok: false,
            reason: data.error || "Failed to delete contribution",
          };
        }
        await refreshGoals();
        await refreshContributions(goalId);
        return { ok: true };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshGoals, refreshContributions],
  );

  // ✅ الحل الأول: استخدام useRef لتجنب الاستدعاء المتزامن في أول مرة
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // استخدام setTimeout لتأخير التحديث
      setTimeout(() => {
        refreshGoals();
      }, 0);
    }
  }, [refreshGoals]);

  // ✅ الحل الثاني: نفس الشيء لـ selectedGoal
  useEffect(() => {
    if (selectedGoal && !isInitialMount.current) {
      const timer = setTimeout(() => {
        refreshContributions(selectedGoal.id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedGoal, refreshContributions]);

  return {
    goals,
    contributions,
    loading,
    selectedGoal,
    setSelectedGoal,
    refreshGoals,
    refreshContributions,
    fetchGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
  };
};
