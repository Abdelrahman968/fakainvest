"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const monthlyTrend = [
  { month: "Nov", spent: 9420 },
  { month: "Dec", spent: 11200 },
  { month: "Jan", spent: 10180 },
  { month: "Feb", spent: 9870 },
  { month: "Mar", spent: 11380 },
  { month: "Apr", spent: 8942 },
];

export default function TrendChart() {
  const t = useTranslations("Budget");
  const maxTrend = Math.max(...monthlyTrend.map((m) => m.spent));

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-semibold">{t("trendTitle")}</h2>
        <span className="text-xs text-muted-foreground">
          {t("spentPerMonth")}
        </span>
      </div>

      <div className="flex h-32 items-end gap-3">
        {monthlyTrend.map((m, i) => {
          const height = (m.spent / maxTrend) * 100;
          const isCurrent = i === monthlyTrend.length - 1;

          return (
            <div
              key={m.month}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div className="flex h-full w-full items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-300",
                    isCurrent ? "bg-gradient-accent shadow-glow" : "bg-muted",
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  isCurrent
                    ? "font-bold text-primary-glow"
                    : "text-muted-foreground",
                )}
              >
                {m.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
