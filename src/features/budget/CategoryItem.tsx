"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import CategoryIcon from "./CategoryIcon";
import type { BudgetCategory } from "@/hooks/useBudget";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface CategoryItemProps {
  category: BudgetCategory;
  isUpdating: boolean;
  onUpdateCap: (id: string, cap: number) => void;
  onRemove: (id: string) => void;
}

export default function CategoryItem({
  category,
  isUpdating,
  onUpdateCap,
  onRemove,
}: CategoryItemProps) {
  const t = useTranslations("Budget");
  const [localCap, setLocalCap] = useState(Number(category.cap));
  const debouncedCap = useDebounce(localCap, 500);
  const hasUpdatedRef = useRef(false);

  const cap = Number(category.cap);
  const spent = Number(category.spent);
  const pct = (spent / Math.max(1, cap)) * 100;
  const warning = pct >= 80 && pct < 100;
  const over = pct >= 100;

  useEffect(() => {
    if (debouncedCap !== cap && !hasUpdatedRef.current) {
      hasUpdatedRef.current = true;
      onUpdateCap(category.id, debouncedCap);
      setTimeout(() => {
        hasUpdatedRef.current = false;
      }, 1000);
    }
  }, [debouncedCap, cap, category.id, onUpdateCap]);

  const handleCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCap(Number(e.target.value));
  };

  return (
    <div className="glass-card p-4">
      <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CategoryIcon emoji={category.emoji} />
          <p className="font-display font-semibold">{category.name}</p>
          {warning && (
            <span className="stat-pill bg-warning/15 text-warning">
              <AlertTriangle className="h-3 w-3" /> {t("warningLeft")}
            </span>
          )}
          {over && (
            <span className="stat-pill bg-destructive/15 text-destructive">
              {t("over")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            <span
              className={cn(
                over && "text-destructive",
                warning && "text-warning",
              )}
            >
              {spent.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {" "}
              / {cap.toLocaleString()}
            </span>
          </p>
          <button
            onClick={() => onRemove(category.id)}
            className="text-muted-foreground transition-colors hover:text-destructive"
            disabled={isUpdating}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            over
              ? "bg-destructive"
              : warning
                ? "bg-warning"
                : "bg-gradient-accent",
          )}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground">{t("cap")}</span>
        {isUpdating ? (
          <div className="flex-1 flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={localCap}
              onChange={handleCapChange}
              className="flex-1 accent-primary-glow"
            />
            <span className="w-16 text-right text-xs font-semibold">
              EGP {localCap.toLocaleString()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
