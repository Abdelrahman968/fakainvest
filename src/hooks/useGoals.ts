"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  deadline: string;
  color: string;
  created_at: string;
  updated_at: string;
  progress: number;
  remaining: number;
  dailyRequired: number | null;
};

export const dailyRequired = (goal: Goal): number => {
  if (!goal.deadline) return 0;
  const daysLeft = Math.max(
    1,
    Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000),
  );
  const remaining = Math.max(0, goal.target - goal.saved);
  return Math.ceil(remaining / daysLeft);
};

export const useGoals = () => {
  const t = useTranslations("Goals");
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refreshGoals = useCallback(async () => {
    if (!user) {
      if (isMounted.current) {
        setGoals([]);
        setLoading(false);
      }
      return;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/goals", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!isMounted.current) return;

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to fetch goals");
      }

      const data = await res.json();
      setGoals(data.goals || []);
    } catch (err) {
      if (!isMounted.current) return;

      let errorMessage = t("errors.fetchFailed");
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = t("errors.timeout");
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      console.error("Error fetching goals:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user, t]);

  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  const createGoal = useCallback(
    async (input: {
      title: string;
      emoji: string;
      category: GoalCategory;
      target: number;
      deadline: string;
      color: string;
    }): Promise<{ ok: boolean; error?: string; goal?: Goal }> => {
      if (!user) {
        const errorMsg = t("errors.notAuthenticated");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      if (!input.title.trim()) {
        const errorMsg = t("errors.titleRequired");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      if (!input.target || input.target <= 0) {
        const errorMsg = t("errors.invalidTarget");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      if (!input.deadline) {
        const errorMsg = t("errors.deadlineRequired");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const payload = {
          title: input.title,
          emoji: input.emoji,
          category: input.category,
          targetAmount: input.target,
          deadline: input.deadline,
          color: input.color,
        };

        console.log("Sending payload:", payload);
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await res.json();

        if (!res.ok) {
          const errorMsg = data.error || t("errors.createFailed");
          toast.error(errorMsg);
          return { ok: false, error: errorMsg };
        }

        await refreshGoals();
        toast.success(t("success.created"));
        return { ok: true, goal: data.goal };
      } catch (err) {
        console.error("Create goal error:", err);
        const errorMsg =
          err instanceof Error && err.name === "AbortError"
            ? t("errors.timeout")
            : t("errors.networkError");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }
    },
    [user, refreshGoals, t],
  );

  const contribute = useCallback(
    async (
      goalId: string,
      amount: number,
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!user) {
        const errorMsg = t("errors.notAuthenticated");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        const errorMsg = t("errors.invalidAmount");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch("/api/goals/contribute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goalId, amount }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMsg = t("errors.contributeFailed");
          try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } catch (e) {
            errorMsg = res.statusText || errorMsg;
          }
          toast.error(errorMsg);
          return { ok: false, error: errorMsg };
        }

        let data;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          const errorMsg = t("errors.networkError");
          toast.error(errorMsg);
          return { ok: false, error: errorMsg };
        }

        await refreshGoals();
        toast.success(
          t("success.contributed", { amount: amount.toLocaleString() }),
        );
        return { ok: true };
      } catch (err) {
        console.error("Contribute error:", err);
        const errorMsg =
          err instanceof Error && err.name === "AbortError"
            ? t("errors.timeout")
            : t("errors.networkError");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }
    },
    [user, refreshGoals, t],
  );

  const removeGoal = useCallback(
    async (goalId: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user) {
        const errorMsg = t("errors.notAuthenticated");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`/api/goals/${goalId}`, {
          method: "DELETE",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMsg = t("errors.deleteFailed");
          try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } catch (e) {
            errorMsg = res.statusText || errorMsg;
          }
          toast.error(errorMsg);
          return { ok: false, error: errorMsg };
        }

        setGoals((prev) => prev.filter((g) => g.id !== goalId));
        toast.success(t("success.deleted"));
        return { ok: true };
      } catch (err) {
        console.error("Delete goal error:", err);
        const errorMsg =
          err instanceof Error && err.name === "AbortError"
            ? t("errors.timeout")
            : t("errors.networkError");
        toast.error(errorMsg);
        return { ok: false, error: errorMsg };
      }
    },
    [user, t],
  );

  return {
    goals,
    loading,
    error,
    refreshGoals,
    createGoal,
    contribute,
    removeGoal,
  };
};
