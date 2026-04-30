"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Property = {
  _id: string;
  name: string;
  location: string;
  emoji: string;
  total_value: number;
  share_price: number;
  shares_available: number;
  total_shares: number;
  yield_pct: number;
  appreciation_1y: number;
  occupancy: number;
  type: "Residential" | "Commercial" | "Vacation" | "Office";
  color: string;
};

export type PropertyHolding = {
  _id: string;
  userId: string;
  propertyId: string;
  shares: number;
};

export const useProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [holdings, setHoldings] = useState<PropertyHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setProperties([]);
      setHoldings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/properties");
      if (!res.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await res.json();
      setProperties(data.properties || []);
      setHoldings(data.holdings || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sharesOwned = useCallback(
    (propertyId: string) => {
      return holdings
        .filter((h) => h.propertyId === propertyId)
        .reduce((sum, h) => sum + h.shares, 0);
    },
    [holdings],
  );

  const buyShares = useCallback(
    async (
      propertyId: string,
      shares: number,
    ): Promise<{ ok: true } | { ok: false; reason: string }> => {
      if (!user) return { ok: false, reason: "Not signed in" };
      if (shares <= 0) return { ok: false, reason: "Invalid share count" };

      const property = properties.find((p) => p._id === propertyId);
      if (!property) return { ok: false, reason: "Property not found" };
      if (shares > property.shares_available) {
        return { ok: false, reason: "Not enough shares available" };
      }

      try {
        const res = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, shares }),
        });

        const data = await res.json();
        if (!res.ok) {
          return { ok: false, reason: data.error || "Failed to buy shares" };
        }

        await refresh();
        return { ok: true };
      } catch (err) {
        console.error("Error buying shares:", err);
        return { ok: false, reason: "Network error" };
      }
    },
    [user, properties, refresh],
  );

  return {
    properties,
    holdings,
    loading,
    error,
    refresh,
    sharesOwned,
    buyShares,
  };
};
