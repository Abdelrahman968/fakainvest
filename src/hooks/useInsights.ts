"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type NetWorthPoint = {
  month: string;
  value: number;
};

export type Prediction = {
  id: string;
  title: string;
  value: string;
  change: number;
  emoji: string;
  desc: string;
};

export type AllocationDrift = {
  name: string;
  target: number;
  actual: number;
  color: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  emoji: string;
  cap: number;
  spent: number;
  last_month?: number;
};

export const useInsights = () => {
  const { user } = useAuth();
  const [netWorth, setNetWorth] = useState<NetWorthPoint[]>([]);
  const [spendingHeatmap, setSpendingHeatmap] = useState<number[][]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allocationDrift, setAllocationDrift] = useState<AllocationDrift[]>([]);
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
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
      const [
        netWorthRes,
        heatmapRes,
        predictionsRes,
        allocationRes,
        budgetRes,
      ] = await Promise.all([
        fetch("/api/insights/net-worth"),
        fetch("/api/insights/spending-heatmap"),
        fetch("/api/insights/predictions"),
        fetch("/api/insights/allocation-drift"),
        fetch("/api/budget"),
      ]);

      if (netWorthRes.ok) {
        const data = await netWorthRes.json();
        setNetWorth(data.series || []);
      }

      if (heatmapRes.ok) {
        const data = await heatmapRes.json();
        setSpendingHeatmap(data.heatmap || []);
      }

      if (predictionsRes.ok) {
        const data = await predictionsRes.json();
        setPredictions(data.predictions || []);
      }

      if (allocationRes.ok) {
        const data = await allocationRes.json();
        setAllocationDrift(data.allocationDrift || []);
      }

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudget(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError("Failed to load insights data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getTotalBudget = useCallback(() => {
    return budget.reduce((sum, cat) => sum + cat.cap, 0);
  }, [budget]);

  const getTotalSpent = useCallback(() => {
    return budget.reduce((sum, cat) => sum + cat.spent, 0);
  }, [budget]);

  return {
    netWorth,
    spendingHeatmap,
    predictions,
    allocationDrift,
    budget,
    loading,
    error,
    refresh,
    getTotalBudget,
    getTotalSpent,
  };
};
