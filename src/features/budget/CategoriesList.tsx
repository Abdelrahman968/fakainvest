"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import CategoryItem from "./CategoryItem";
import type { BudgetCategory } from "@/hooks/useBudget";

interface CategoriesListProps {
  budget: BudgetCategory[];
  loading: boolean;
  updatingId: string | null;
  onUpdateCap: (id: string, cap: number) => void;
  onRemove: (id: string) => void;
}

export default function CategoriesList({
  budget,
  loading,
  updatingId,
  onUpdateCap,
  onRemove,
}: CategoriesListProps) {
  const t = useTranslations("Budget");

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="font-display font-semibold">{t("categories")}</h2>
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display font-semibold">{t("categories")}</h2>

      {budget.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        budget.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isUpdating={updatingId === category.id}
            onUpdateCap={onUpdateCap}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
