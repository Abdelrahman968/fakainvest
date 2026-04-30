"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BudgetSummaryProps {
  totalSpent: number;
  totalCap: number;
  monthChange: number;
}

export default function BudgetSummary({
  totalSpent,
  totalCap,
  monthChange,
}: BudgetSummaryProps) {
  const t = useTranslations("Budget");
  const percentage = Math.min(100, (totalSpent / totalCap) * 100);

  return (
    <div className="rounded-3xl bg-gradient-hero p-6 shadow-elegant">
      <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
        {t("thisMonth")}
      </p>
      <p className="mt-1 font-display text-4xl font-bold text-primary-foreground">
        EGP {totalSpent.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-primary-foreground/70">
        {t("ofBudget", { total: totalCap.toLocaleString() })}
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-foreground/10">
        <div
          className="h-full rounded-full bg-gradient-accent transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            "stat-pill",
            monthChange < 0
              ? "bg-accent/20 text-accent"
              : "bg-destructive/20 text-destructive",
          )}
        >
          {monthChange < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          {Math.abs(monthChange).toFixed(1)}% {t("vsLastMonth")}
        </span>
      </div>
    </div>
  );
}
