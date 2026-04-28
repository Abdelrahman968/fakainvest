"use client";

import { Flame, Award } from "lucide-react";
import { useTranslations } from "next-intl";

interface StreakCardProps {
  streak: number;
  badge: string;
}

export default function StreakCard({ streak, badge }: StreakCardProps) {
  const t = useTranslations("DashboardPage");

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t("streak")}</p>
        <Flame className="h-4 w-4 text-warning" />
      </div>
      <div className="flex items-end gap-2">
        <p className="font-display text-3xl font-bold">{streak}</p>
        <p className="mb-1 text-xs text-muted-foreground">{t("days")}</p>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-warning">
        <Award className="h-3.5 w-3.5" />
        <span>{t(badge)}</span>
      </div>
    </div>
  );
}
