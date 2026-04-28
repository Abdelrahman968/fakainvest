"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Transaction = {
  id: string;
  merchant: string;
  category:
    | "Food"
    | "Transport"
    | "Shopping"
    | "Bills"
    | "Entertainment"
    | "Coffee";
  amount: number;
  roundUp: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  userId: string;
};

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const isInitialMount = useRef(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
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
    const pendingAmount = pendingTransactions.reduce(
      (s, t) => s + t.roundUp,
      0,
    );

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
    investNow,
    refresh,
  };
};
