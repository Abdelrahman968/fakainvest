"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export type BudgetCategory = {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  cap: number;
  spent: number;
  last_month: number;
  month_key: string;
  created_at: string;
  updated_at: string;
};

export const useBudget = () => {
  const t = useTranslations("Budget");
  const { user } = useAuth();
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      if (isMounted.current) {
        setBudget([]);
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

      const res = await fetch("/api/budget", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!isMounted.current) return;

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to fetch budget");
      }

      const data = await res.json();
      setBudget(data.categories || []);
    } catch (err) {
      if (!isMounted.current) return;

      let errorMessage = "Failed to fetch budget";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timeout";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      console.error("Error fetching budget:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateCap = async (id: string, cap: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`/api/budget/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cap }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Update failed" }));
        toast.error(errorData.error || "Failed to update budget cap");
        return false;
      }

      await refresh();
      toast.success(t("success.capUpdated"));
      return true;
    } catch (err) {
      console.error("Update cap error:", err);
      toast.error("Network error");
      return false;
    }
  };

  const add = async (
    name: string,
    emoji: string,
    cap: number,
  ): Promise<boolean> => {
    if (!user) return false;

    if (!name.trim()) {
      toast.error(t("errors.nameRequired"));
      return false;
    }

    if (!cap || cap <= 0) {
      toast.error(t("errors.invalidCap"));
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const currentMonthKey = new Date().toISOString().slice(0, 7);

      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          emoji,
          cap,
          monthKey: currentMonthKey,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Create failed" }));
        toast.error(errorData.error || "Failed to create category");
        return false;
      }

      await refresh();
      toast.success(t("success.categoryAdded"));
      return true;
    } catch (err) {
      console.error("Add category error:", err);
      toast.error("Network error");
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`/api/budget/${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Delete failed" }));
        toast.error(errorData.error || "Failed to delete category");
        return false;
      }

      setBudget((prev) => prev.filter((c) => c.id !== id));
      toast.success(t("success.categoryDeleted"));
      return true;
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error("Network error");
      return false;
    }
  };

  const getSpentPercentage = useCallback((category: BudgetCategory) => {
    return category.cap > 0 ? (category.spent / category.cap) * 100 : 0;
  }, []);

  const getRemaining = useCallback((category: BudgetCategory) => {
    return Math.max(0, category.cap - category.spent);
  }, []);

  const getTotalBudget = useCallback(() => {
    return budget.reduce((total, cat) => total + cat.cap, 0);
  }, [budget]);

  const getTotalSpent = useCallback(() => {
    return budget.reduce((total, cat) => total + cat.spent, 0);
  }, [budget]);

  return {
    budget,
    loading,
    error,
    refresh,
    updateCap,
    add,
    remove,
    getSpentPercentage,
    getRemaining,
    getTotalBudget,
    getTotalSpent,
  };
};
