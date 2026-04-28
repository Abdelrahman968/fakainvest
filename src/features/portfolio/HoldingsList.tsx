"use client";

import { useMemo } from "react";
import HoldingItem from "./HoldingItem";
import type { Holding } from "@/hooks/useHoldings";
import { useTranslations } from "next-intl";

interface HoldingsListProps {
  holdings: Holding[];
}

export default function HoldingsList({ holdings }: HoldingsListProps) {
  const t = useTranslations("Portfolio");
  const total = useMemo(() => {
    return holdings.reduce((s, h) => s + h.amount, 0);
  }, [holdings]);

  if (holdings.length === 0) {
    return (
      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">
          {t("individual_holdings")}
        </h2>
        <div className="glass-card p-8 text-center text-muted-foreground">
          {t("no_holdings_yet")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-semibold">
        {t("individual_holdings")}
      </h2>
      <ul className="space-y-2">
        {holdings.map((h) => {
          const percentage = (h.amount / total) * 100;
          return <HoldingItem key={h.id} holding={h} percentage={percentage} />;
        })}
      </ul>
    </div>
  );
}
