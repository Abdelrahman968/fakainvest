"use client";

import { useTranslations } from "next-intl";

interface RulesStatsProps {
  activeCount: number;
  totalTriggered: number;
}

export default function RulesStats({
  activeCount,
  totalTriggered,
}: RulesStatsProps) {
  const t = useTranslations("Rules");

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">{t("activeRules")}</p>
        <p className="mt-1 font-display text-2xl font-bold">{activeCount}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">
          {t("triggeredThisMonth")}
        </p>
        <p className="mt-1 font-display text-2xl font-bold gradient-text">
          {totalTriggered}
        </p>
      </div>
    </div>
  );
}
