"use client";

import { useTranslations } from "next-intl";
import type { AllocationDrift as AllocationDriftType } from "@/hooks/useInsights";

interface AllocationDriftProps {
  allocationDrift: AllocationDriftType[];
}

export default function AllocationDrift({
  allocationDrift,
}: AllocationDriftProps) {
  const t = useTranslations("Insights");

  return (
    <section className="glass-card p-5">
      <p className="text-xs text-muted-foreground">{t("targetVsActual")}</p>
      <h3 className="mb-4 font-display text-lg font-semibold">
        {t("portfolioDrift")}
      </h3>
      <ul className="space-y-3">
        {allocationDrift.map((a) => (
          <li key={a.name}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `hsl(${a.color})` }}
                />
                {a.name}
              </span>
              <span
                className={`font-semibold ${
                  Math.abs(a.actual - a.target) < 1
                    ? "text-muted-foreground"
                    : a.actual > a.target
                      ? "text-warning"
                      : "text-primary-glow"
                }`}
              >
                {a.actual - a.target > 0 ? "+" : ""}
                {(a.actual - a.target).toFixed(1)}%
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-secondary/50">
              <div
                className="absolute inset-y-0 left-0 rounded-full opacity-40"
                style={{
                  width: `${a.target}%`,
                  background: `hsl(${a.color})`,
                }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${a.actual}%`,
                  background: `hsl(${a.color})`,
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>
                {t("target")} {a.target}%
              </span>
              <span>
                {t("actual")} {a.actual}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
