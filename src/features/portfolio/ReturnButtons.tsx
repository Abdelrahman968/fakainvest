"use client";

import { cn } from "@/lib/utils";
import type { Range } from "@/types/portfolio";

interface ReturnButtonsProps {
  ranges: Range[];
  currentRange: Range;
  onRangeChange: (range: Range) => void;
}

export default function ReturnButtons({
  ranges,
  currentRange,
  onRangeChange,
}: ReturnButtonsProps) {
  return (
    <div className="mt-5 flex gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onRangeChange(r)}
          className={cn(
            "flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all",
            currentRange === r
              ? "bg-primary-foreground text-background"
              : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20",
          )}
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
