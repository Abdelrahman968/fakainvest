"use client";

import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface HealthScoreCardProps {
  score: number;
}

export default function HealthScoreCard({ score }: HealthScoreCardProps) {
  const t = useTranslations("DashboardPage");

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t("healthScore")}</p>
        <TrendingUp className="h-4 w-4 text-accent" />
      </div>
      <div className="flex items-end gap-2">
        <p className="font-display text-3xl font-bold">{score}</p>
        <p className="mb-1 text-xs text-muted-foreground">/100</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-accent"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
