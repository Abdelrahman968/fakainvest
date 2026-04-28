"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type HoldingType =
  | "Savings Cert"
  | "Stocks"
  | "Gold"
  | "Money Market"
  | "Sukuk";

export type Holding = {
  id: string;
  user_id: string;
  name: string;
  type: HoldingType;
  amount: number;
  return1m: number;
  color: string;
  created_at: string;
  updated_at: string;
};

export type CreateHoldingInput = {
  name: string;
  type: HoldingType;
  amount: number;
  return1m?: number;
  color?: string;
};

export type UpdateHoldingInput = Partial<Omit<CreateHoldingInput, "type">> & {
  type?: HoldingType;
};

export const useHoldings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const isInitialMount = useRef(true);

  const refreshHoldings = useCallback(async () => {
    if (!user) {
      setHoldings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/holdings");
      if (res.ok) {
        const data = await res.json();
        setHoldings(data.holdings || []);
      } else {
        setHoldings([]);
      }
    } catch (err) {
      console.error("[useHoldings] Error fetching holdings:", err);
      setHoldings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchHoldingById = useCallback(
    async (holdingId: string) => {
      if (!user) return null;

      try {
        const res = await fetch(`/api/holdings/${holdingId}`);
        if (res.ok) {
          const data = await res.json();
          return data.holding;
        }
      } catch (err) {
        console.error("[useHoldings] Error fetching holding:", err);
      }
      return null;
    },
    [user],
  );

  const createHolding = useCallback(
    async (
      input: CreateHoldingInput,
    ): Promise<
      { ok: true; holding: Holding } | { ok: false; reason: string }
    > => {
      if (!user) return { ok: false, reason: "Not authenticated" };
      if (!input.name?.trim()) return { ok: false, reason: "Name is required" };
      if (!input.type) return { ok: false, reason: "Type is required" };
      if (!input.amount || input.amount <= 0) {
        return { ok: false, reason: "Amount must be greater than 0" };
      }

      try {
        const res = await fetch("/api/holdings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...input,
            return1m: input.return1m || 0,
            color: input.color || "199 89% 60%",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            reason: data.error || "Failed to create holding",
          };
        }
        await refreshHoldings();
        return { ok: true, holding: data.holding };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshHoldings],
  );

  const updateHolding = useCallback(
    async (
      holdingId: string,
      updates: UpdateHoldingInput,
    ): Promise<
      { ok: true; holding: Holding } | { ok: false; reason: string }
    > => {
      if (!user) return { ok: false, reason: "Not authenticated" };

      try {
        const res = await fetch(`/api/holdings/${holdingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            reason: data.error || "Failed to update holding",
          };
        }
        await refreshHoldings();
        return { ok: true, holding: data.holding };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshHoldings],
  );

  const deleteHolding = useCallback(
    async (
      holdingId: string,
    ): Promise<{ ok: true } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not authenticated" };

      try {
        const res = await fetch(`/api/holdings/${holdingId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          return {
            ok: false,
            reason: data.error || "Failed to delete holding",
          };
        }
        await refreshHoldings();
        if (selectedHolding?.id === holdingId) setSelectedHolding(null);
        return { ok: true };
      } catch {
        return { ok: false, reason: "Network error" };
      }
    },
    [user, refreshHoldings, selectedHolding],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setTimeout(() => {
        refreshHoldings();
      }, 0);
    }
  }, [refreshHoldings]);

  return {
    holdings,
    loading,
    selectedHolding,
    setSelectedHolding,
    refreshHoldings,
    fetchHoldingById,
    createHolding,
    updateHolding,
    deleteHolding,
  };
};
