"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type MarketRate = {
  _id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  icon: string;
  color: string;
};

export type BankCertificate = {
  _id: string;
  bank: string;
  name: string;
  rate: number;
  term: string;
  min: number;
  isBest: boolean;
};

export type CashbackOffer = {
  _id: string;
  brand: string;
  category: string;
  cashback: string;
  cashbackValue: number;
  emoji: string;
  color: string;
};

export const useMarket = () => {
  const { user } = useAuth();
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [certificates, setCertificates] = useState<BankCertificate[]>([]);
  const [offers, setOffers] = useState<CashbackOffer[]>([]);
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
      const [ratesRes, certsRes, offersRes] = await Promise.all([
        fetch("/api/market/rates"),
        fetch("/api/market/certificates"),
        fetch("/api/market/offers"),
      ]);

      if (ratesRes.ok) {
        const data = await ratesRes.json();
        setRates(data.rates || []);
      }

      if (certsRes.ok) {
        const data = await certsRes.json();
        setCertificates(data.certificates || []);
      }

      if (offersRes.ok) {
        const data = await offersRes.json();
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.error("Error fetching market data:", err);
      setError("Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    rates,
    certificates,
    offers,
    loading,
    error,
    refresh,
  };
};
