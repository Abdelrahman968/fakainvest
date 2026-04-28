"use client";

import { useMemo } from "react";
import type { Holding } from "@/hooks/useHoldings";

interface HoldingItemProps {
  holding: Holding;
  percentage: number;
}

export default function HoldingItem({ holding, percentage }: HoldingItemProps) {
  const backgroundColor = useMemo(() => {
    return holding.color.startsWith("hsl")
      ? holding.color
      : `hsl(${holding.color})`;
  }, [holding.color]);

  return (
    <li className="glass-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold">{holding.name}</p>
          <p className="text-xs text-muted-foreground">{holding.type}</p>
        </div>
        <div className="text-right">
          <p className="font-display font-bold">
            EGP{" "}
            {holding.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-accent">+{holding.return1m}% (1m)</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor,
            }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </li>
  );
}
