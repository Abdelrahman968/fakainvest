"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import type { Holding } from "@/hooks/useHoldings";
import { useTranslations } from "next-intl";

interface AllocationChartProps {
  holdings: Holding[];
}

export default function AllocationChart({ holdings }: AllocationChartProps) {
  const total = useMemo(() => {
    return holdings.reduce((s, h) => s + h.amount, 0);
  }, [holdings]);
  const t = useTranslations("Portfolio");

  const conicGradient = useMemo(() => {
    if (holdings.length === 0 || total === 0) return "";

    let acc = 0;
    return holdings
      .map((h) => {
        const start = (acc / total) * 360;
        acc += h.amount;
        const end = (acc / total) * 360;
        const colorValue = h.color.startsWith("hsl")
          ? h.color
          : `hsl(${h.color})`;
        return `${colorValue} ${start}deg ${end}deg`;
      })
      .join(", ");
  }, [holdings, total]);

  if (holdings.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {t("allocation")}
          </h2>
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <div className="py-12 text-center text-muted-foreground">
          {t("holdings_not_found")}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          {t("allocation")}
        </h2>
        <TrendingUp className="h-4 w-4 text-accent" />
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ background: `conic-gradient(${conicGradient})` }}
          />
          <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-card">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {t("holdings")}
            </p>
            <p className="font-display text-2xl font-bold">{holdings.length}</p>
          </div>
        </div>

        <ul className="w-full flex-1 space-y-2">
          {holdings.map((h) => {
            const pct = (h.amount / total) * 100;
            return (
              <li key={h.id} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: h.color.startsWith("hsl")
                      ? h.color
                      : `hsl(${h.color})`,
                  }}
                />
                <span className="flex-1 text-sm">{h.type}</span>
                <span className="text-sm font-semibold">{pct.toFixed(0)}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
