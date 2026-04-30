"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import type { NetWorthPoint } from "@/hooks/useInsights";

interface NetWorthChartProps {
  netWorth: NetWorthPoint[];
}

const fmt = (n: number) =>
  n?.toLocaleString?.("en-EG", { maximumFractionDigits: 0 }) || "0";

type Period = "1M" | "6M" | "12M" | "All";

export default function NetWorthChart({ netWorth }: NetWorthChartProps) {
  const t = useTranslations("Insights");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("12M");

  const filteredData = useMemo(() => {
    if (!netWorth || netWorth.length === 0) return [];

    const periods: Record<Period, number> = {
      "1M": 1,
      "6M": 6,
      "12M": 12,
      All: netWorth.length,
    };

    const monthsToShow = periods[selectedPeriod];
    return netWorth.slice(-Math.min(monthsToShow, netWorth.length));
  }, [netWorth, selectedPeriod]);

  if (!filteredData || filteredData.length === 0) {
    return (
      <section className="glass-card p-5 md:p-6">
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </section>
    );
  }

  const values = filteredData.map((p) => p.value).filter((v) => isFinite(v));
  const max = values.length > 0 ? Math.max(...values) : 100;
  const min = values.length > 0 ? Math.min(...values) : 0;
  const range = max - min || 1;

  const w = 100;
  const h = 100;

  const points = filteredData.map((p, i) => {
    const x =
      filteredData.length > 1 ? (i / (filteredData.length - 1)) * w : w / 2;
    const y = h - ((p.value - min) / range) * (h - 10) - 5;
    return [isFinite(x) ? x : 50, isFinite(y) ? y : 50] as const;
  });

  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  const firstValue = filteredData[0]?.value || 0;
  const lastValue = filteredData[filteredData.length - 1]?.value || 0;
  const growth =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  const periods: Period[] = ["1M", "6M", "12M", "All"];

  return (
    <section className="glass-card p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("netWorthTitle")}</p>
          <p className="font-display text-3xl font-bold">
            EGP {fmt(lastValue)}
          </p>
          <p
            className={`flex items-center gap-1 text-xs font-semibold ${growth >= 0 ? "text-accent" : "text-destructive"}`}
          >
            <TrendingUp
              className={`h-3 w-3 ${growth < 0 ? "rotate-180" : ""}`}
            />
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}% {t("change")}
          </p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                selectedPeriod === p
                  ? "bg-gradient-accent text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="relative aspect-16/6 w-full">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="netGrad" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(199 89% 60%)"
                stopOpacity="0.45"
              />
              <stop
                offset="100%"
                stopColor="hsl(199 89% 60%)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#netGrad)" />
          <path
            d={path}
            fill="none"
            stroke="hsl(199 89% 60%)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          {points.map(([x, y], i) => (
            <circle
              key={`circle-${i}`}
              cx={x}
              cy={y}
              r="0.7"
              fill="hsl(199 89% 60%)"
              stroke="hsl(var(--background))"
              strokeWidth="0.3"
            />
          ))}
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {filteredData.map((p, i) => (
          <span key={`${p.month}-${i}`}>{p.month}</span>
        ))}
      </div>
    </section>
  );
}
