"use client";

import { useTranslations } from "next-intl";

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

interface StatsCardsProps {
  moneyIn: number;
  moneyOut: number;
  net: number;
}

const StatsCards = ({ moneyIn, moneyOut, net }: StatsCardsProps) => {
  const t = useTranslations("Transactions");

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="glass-card p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {t("moneyIn")}
        </p>
        <p className="font-display text-xl font-bold text-accent">
          +EGP {fmt(moneyIn)}
        </p>
      </div>
      <div className="glass-card p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {t("moneyOut")}
        </p>
        <p className="font-display text-xl font-bold">-EGP {fmt(moneyOut)}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {t("net")}
        </p>
        <p
          className={`font-display text-xl font-bold ${
            net >= 0 ? "text-accent" : "text-destructive"
          }`}
        >
          {net >= 0 ? "+" : ""}EGP {fmt(net)}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
