"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  roundUp: number;
  originalAmount?: number;
  isRoundUpProcessed?: boolean;
  date: string;
  status: string;
  userId: string;
};

const getMockPendingRoundUps = (
  mode: string,
  customAmount?: number,
): number => {
  switch (mode) {
    case "Eco":
      return 5;
    case "Boost":
      return 10;
    case "Fixed20":
      return 20;
    case "Custom":
      return customAmount || 10;
    case "None":
      return 0;
    default:
      return 5;
  }
};

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [pendingRoundUps, setPendingRoundUps] = useState(0);
  const isInitialMount = useRef(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setPendingRoundUps(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);

        const realPending = (data.transactions || [])
          .filter((t: any) => t.roundUp > 0 && !t.isRoundUpProcessed)
          .reduce((sum: number, t: any) => sum + (t.roundUp || 0), 0);

        if (realPending > 0) {
          setPendingRoundUps(realPending);
        } else {
          const mode = user.roundUpMode || "Boost";
          const customAmount = (user as any).customRoundUpAmount || 10;
          const mockPending = getMockPendingRoundUps(mode, customAmount);

          setPendingRoundUps(mockPending);
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      const mode = user.roundUpMode || "Boost";
      const customAmount = (user as any).customRoundUpAmount || 10;
      setPendingRoundUps(getMockPendingRoundUps(mode, customAmount));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      refresh();
    }
  }, [refresh]);

  const filteredTransactions = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter((t) => t.category === filter);
  }, [transactions, filter]);

  const stats = useMemo(() => {
    const totalRoundUp = filteredTransactions.reduce(
      (s, t) => s + t.roundUp,
      0,
    );
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.status === "Pending",
    );
    const pendingAmount = pendingTransactions.reduce((s, t) => s + t.amount, 0);

    return {
      totalRoundUp,
      pendingCount: pendingTransactions.length,
      pendingAmount,
    };
  }, [filteredTransactions]);

  const investNow = async (transactionId?: string) => {
    try {
      const url = transactionId
        ? `/api/transactions/${transactionId}/invest`
        : "/api/transactions/invest-all";

      const res = await fetch(url, { method: "POST" });

      if (res.ok) {
        await refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error investing:", error);
      return false;
    }
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    filter,
    setFilter,
    stats,
    pendingRoundUps,
    investNow,
    refresh,
  };
};
