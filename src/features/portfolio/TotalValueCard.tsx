"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import ReturnButtons from "./ReturnButtons";
import type { Range } from "@/types/portfolio";
import { useTranslations } from "next-intl";

interface TotalValueCardProps {
  total: number;
  portfolioReturn: number;
  range: Range;
  onRangeChange: (range: Range) => void;
  loading?: boolean;
}

export default function TotalValueCard({
  total,
  portfolioReturn,
  range,
  onRangeChange,
  loading = false,
}: TotalValueCardProps) {
  const t = useTranslations("Portfolio");
  const ranges: Range[] = ["1m", "6m", "12m"];

  return (
    <div className="rounded-3xl bg-linear-to-br from-blue-600 to-blue-800 p-6 shadow-elegant">
      <p className="text-xs uppercase tracking-widest text-white/70">
        {t("total_value")}
      </p>
      <p className="mt-1 font-display text-4xl font-bold text-white">
        {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
        {t("currency")}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <span className="stat-pill bg-green-500/20 text-green-400">
            <ArrowUpRight className="h-3 w-3" />+{portfolioReturn}%
          </span>
        )}
        <span className="text-sm text-white/70">
          {t("return")} ({range})
        </span>
      </div>

      <ReturnButtons
        ranges={ranges}
        currentRange={range}
        onRangeChange={onRangeChange}
      />
    </div>
  );
}
