"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Prediction } from "@/hooks/useInsights";

interface PredictionsGridProps {
  predictions: Prediction[];
}

export default function PredictionsGrid({ predictions }: PredictionsGridProps) {
  const t = useTranslations("Insights");

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {predictions.map((p) => (
        <article key={p.id} className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{p.emoji}</span>
            {p.change !== 0 && (
              <span
                className={`stat-pill ${
                  p.change > 0
                    ? "bg-accent/15 text-accent"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {p.change > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(p.change)}%
              </span>
            )}
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            {t(`${p.id}`) || p.title}
          </p>
          <p className="font-display text-lg font-bold">{p.value}</p>
          <p className="text-[11px] text-muted-foreground">
            {t(`${p.id + "Desc"}`) || p.desc}
          </p>
        </article>
      ))}
    </section>
  );
}
