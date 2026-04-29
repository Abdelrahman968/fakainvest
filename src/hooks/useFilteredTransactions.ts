"use client";

import { useMemo, useState } from "react";
import type { Transfer } from "@/hooks/useWallet";

type Filt = "all" | "in" | "out";

export const useFilteredTransactions = (transfers: Transfer[]) => {
  const [q, setQ] = useState("");
  const [filt, setFilt] = useState<Filt>("all");

  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      const isIn =
        t.type === "received" || t.type === "deposit" || t.type === "topup";
      const isOut = t.type === "sent" || t.type === "card";
      if (filt === "in" && !isIn) return false;
      if (filt === "out" && !isOut) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        t.counterparty.toLowerCase().includes(s) ||
        t.note.toLowerCase().includes(s) ||
        t.method.toLowerCase().includes(s)
      );
    });
  }, [transfers, q, filt]);

  const totals = useMemo(() => {
    let inn = 0,
      out = 0;
    filtered.forEach((t) => {
      if (t.type === "sent" || t.type === "card") out += Number(t.amount);
      else inn += Number(t.amount);
    });
    return { inn, out, net: inn - out };
  }, [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, Transfer[]>();
    filtered.forEach((t) => {
      const k = new Date(t.created_at).toLocaleDateString("en-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return {
    filtered,
    totals,
    grouped,
    q,
    setQ,
    filt,
    setFilt,
  };
};
