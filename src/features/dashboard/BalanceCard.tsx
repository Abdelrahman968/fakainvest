"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface BalanceCardProps {
  balance: number;
  totalInvested: number;
  pendingRoundUps: number;
}

export default function BalanceCard({
  balance,
  totalInvested,
  pendingRoundUps,
}: BalanceCardProps) {
  const t = useTranslations("DashboardPage");
  const allTimeGrowth =
    totalInvested > 0 ? (balance / totalInvested) * 100 - 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 shadow-elegant">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-glow/20 blur-3xl" />
      <p className="relative text-xs uppercase tracking-widest text-primary-foreground/70">
        {t("currentBalance")}
      </p>
      <p className="relative mt-1 font-display text-4xl font-bold text-primary-foreground">
        {balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}{" "}
        {t("currency")}
      </p>
      <div className="relative mt-3 flex items-center gap-2 text-sm">
        <span className="stat-pill bg-accent/20 text-accent">
          <ArrowUpRight className="h-3 w-3" /> {allTimeGrowth >= 0 ? "+" : ""}
          {allTimeGrowth.toFixed(1)}%
        </span>
        <span className="text-primary-foreground/70">{t("allTime")}</span>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-primary-foreground/10 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">
            {t("invested")}
          </p>
          <p className="font-display text-lg font-semibold text-primary-foreground">
            {totalInvested.toLocaleString() || "0.00"} {t("currency")}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">
            {t("pendingRoundUps")}
          </p>
          <p className="font-display text-lg font-semibold text-primary-foreground">
            {pendingRoundUps.toFixed(2) || 0.0} {t("currency")}
          </p>
        </div>
      </div>
    </div>
  );
}
