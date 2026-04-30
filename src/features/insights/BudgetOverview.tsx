"use client";

import { useTranslations } from "next-intl";
import type { BudgetCategory } from "@/hooks/useBudget";

interface BudgetOverviewProps {
  budget: BudgetCategory[];
  totalSpent: number;
  totalBudget: number;
}

const fmt = (n: number) =>
  n.toLocaleString("en-EG", { maximumFractionDigits: 0 });

export default function BudgetOverview({
  budget,
  totalSpent,
  totalBudget,
}: BudgetOverviewProps) {
  const t = useTranslations("Insights");

  return (
    <section className="glass-card p-5">
      <p className="text-xs text-muted-foreground">{t("budgetPulse")}</p>
      <h3 className="mb-4 font-display text-lg font-semibold">
        EGP {fmt(totalSpent)}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          / {fmt(totalBudget)}
        </span>
      </h3>
      <ul className="space-y-2.5">
        {budget?.slice(0, 6).map((b) => {
          const pct = (b.spent / b.cap) * 100;
          const warn = pct > 90;
          return (
            <li key={b.id} className="flex items-center gap-3">
              <span className="text-lg">{b.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium">{b.name}</span>
                  <span
                    className={
                      warn
                        ? "font-semibold text-warning"
                        : "text-muted-foreground"
                    }
                  >
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary/50">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      background: warn
                        ? "hsl(var(--warning))"
                        : "hsl(var(--accent))",
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
