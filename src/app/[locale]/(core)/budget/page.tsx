"use client";

import { useState, useCallback } from "react";
import { useBudget } from "@/hooks/useBudget";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import BudgetHeader from "@/features/budget/BudgetHeader";
import BudgetSummary from "@/features/budget/BudgetSummary";
import TrendChart from "@/features/budget/TrendChart";
import AISuggestion from "@/features/budget/AISuggestion";
import CategoriesList from "@/features/budget/CategoriesList";
import AddCategoryModal from "@/features/budget/AddCategoryModal";

const BudgetPage = () => {
  const t = useTranslations("Budget");
  const { budget, loading, updateCap, add, remove } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalSpent = budget.reduce((s, b) => s + Number(b.spent), 0);
  const totalCap = budget.reduce((s, b) => s + Number(b.cap), 0) || 1;
  const totalLast = budget.reduce((s, b) => s + Number(b.last_month), 0) || 1;
  const monthChange = ((totalSpent - totalLast) / totalLast) * 100;

  const handleAddCategory = useCallback(
    async (name: string, emoji: string, cap: number) => {
      setIsSubmitting(true);
      const success = await add(name, emoji, cap);
      setIsSubmitting(false);

      if (success) {
        setShowAdd(false);
      }
    },
    [add],
  );

  const handleUpdateCap = useCallback(
    async (id: string, newCap: number) => {
      setUpdatingId(id);
      await updateCap(id, newCap);
      setUpdatingId(null);
    },
    [updateCap],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      await remove(id);
    },
    [remove],
  );

  const handleApplySuggestion = useCallback(() => {
    toast.info(t("suggestion.applyMessage"));
  }, [t]);

  return (
    <div className="space-y-5">
      <BudgetHeader onAddClick={() => setShowAdd(true)} />

      <BudgetSummary
        totalSpent={totalSpent}
        totalCap={totalCap}
        monthChange={monthChange}
      />

      <TrendChart />

      <AISuggestion onApply={handleApplySuggestion} />

      <CategoriesList
        budget={budget}
        loading={loading}
        updatingId={updatingId}
        onUpdateCap={handleUpdateCap}
        onRemove={handleRemove}
      />

      <AddCategoryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BudgetPage;
