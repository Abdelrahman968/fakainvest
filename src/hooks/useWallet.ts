"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Wallet = {
  user_id: string;
  balance: number;
  spent_today: number;
  spent_this_month: number;
  spent_today_date: string;
  spent_month_key: string;
  frozen: boolean;
  daily_limit: number;
  monthly_limit: number;
  per_transaction_limit: number;
  online_enabled: boolean;
  contactless_enabled: boolean;
  international_enabled: boolean;
  atm_enabled: boolean;
  card_last_four?: string;
  card_number?: string;
  card_expiry?: string;
  card_cvv?: string;
};

export type Transfer = {
  id: string;
  user_id: string;
  type: "sent" | "received" | "deposit" | "topup" | "card";
  counterparty: string;
  avatar: string;
  amount: number;
  note: string;
  method: "Wallet" | "Bank" | "Card";
  created_at: string;
};

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setWallet(null);
      setTransfers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [walletRes, transfersRes] = await Promise.all([
        fetch("/api/wallet"),
        fetch("/api/transfers"),
      ]);

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData.wallet);
      } else if (walletRes.status === 404) {
        // Create wallet if doesn't exist
        const createRes = await fetch("/api/wallet", { method: "POST" });
        if (createRes.ok) {
          const newWallet = await createRes.json();
          setWallet(newWallet.wallet);
        } else {
          throw new Error("Failed to create wallet");
        }
      } else {
        throw new Error("Failed to fetch wallet");
      }

      if (transfersRes.ok) {
        const transfersData = await transfersRes.json();
        setTransfers(transfersData.transfers || []);
      } else {
        setTransfers([]);
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deposit = async (
    amount: number,
    source: string,
  ): Promise<{ ok: true } | { ok: false; reason: string }> => {
    if (!wallet) return { ok: false, reason: "Wallet not ready" };
    if (!Number.isFinite(amount) || amount <= 0)
      return { ok: false, reason: "Invalid amount" };
    if (amount > 100000)
      return { ok: false, reason: "Max EGP 100,000 per deposit" };

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, source }),
      });
      const data = await res.json();
      if (!res.ok)
        return {
          ok: false,
          reason: data.reason || data.error || "Deposit failed",
        };
      await refresh();
      return { ok: true };
    } catch (error) {
      console.error("Deposit error:", error);
      return { ok: false, reason: "Network error" };
    }
  };

  const send = async (
    amount: number,
    to: string,
    name?: string,
    note = "",
  ): Promise<{ ok: true } | { ok: false; reason: string }> => {
    if (!wallet) return { ok: false, reason: "Wallet not ready" };
    if (!Number.isFinite(amount) || amount <= 0)
      return { ok: false, reason: "Invalid amount" };
    if (amount > wallet.balance)
      return { ok: false, reason: "Insufficient balance" };

    try {
      const res = await fetch("/api/wallet/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, to, name, note }),
      });
      const data = await res.json();
      if (!res.ok)
        return {
          ok: false,
          reason: data.reason || data.error || "Transfer failed",
        };
      await refresh();
      return { ok: true };
    } catch (error) {
      console.error("Send error:", error);
      return { ok: false, reason: "Network error" };
    }
  };

  const cardSpend = async (
    amount: number,
    merchant: string,
  ): Promise<{ ok: true } | { ok: false; reason: string }> => {
    if (!wallet) return { ok: false, reason: "Wallet not ready" };
    if (!Number.isFinite(amount) || amount <= 0)
      return { ok: false, reason: "Invalid amount" };

    try {
      const res = await fetch("/api/wallet/card-spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, merchant }),
      });
      const data = await res.json();
      if (!res.ok)
        return {
          ok: false,
          reason: data.reason || data.error || "Transaction failed",
        };
      await refresh();
      return { ok: true };
    } catch (error) {
      console.error("Card spend error:", error);
      return { ok: false, reason: "Network error" };
    }
  };

  const setFrozen = async (frozen: boolean) => {
    try {
      const res = await fetch("/api/wallet/frozen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frozen }),
      });
      if (res.ok) {
        await refresh();
      }
    } catch (error) {
      console.error("Set frozen error:", error);
    }
  };

  const updateLimits = async (
    patch: Partial<
      Pick<
        Wallet,
        | "daily_limit"
        | "monthly_limit"
        | "per_transaction_limit"
        | "online_enabled"
        | "contactless_enabled"
        | "international_enabled"
        | "atm_enabled"
      >
    >,
  ) => {
    try {
      const res = await fetch("/api/wallet/limits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await refresh();
      }
    } catch (error) {
      console.error("Update limits error:", error);
    }
  };

  return {
    wallet,
    transfers,
    loading,
    refresh,
    deposit,
    send,
    cardSpend,
    setFrozen,
    updateLimits,
  };
};
