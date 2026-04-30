"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "next-intl";

export type ReportData = {
  month: string;
  totalSpent: number;
  spentChange: number;
  totalInvested: number;
  investmentReturn: number;
  topCategory: string;
  topCategoryAmount: number;
  roundUpsThisMonth: number;
  transactionCount: number;
  insight: string;
  tip: string;
};

export const useReport = () => {
  const { user } = useAuth();
  const locale = useLocale();
  const [report, setReport] = useState<ReportData | null>(null);
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
      const res = await fetch(`/api/report?locale=${locale}`);
      if (!res.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err instanceof Error ? err.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [user, locale]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    report,
    loading,
    error,
    refresh,
  };
};
