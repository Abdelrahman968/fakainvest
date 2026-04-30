"use client";

import { Loader2 } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";
import { useBudget } from "@/hooks/useBudget";
import { useTranslations } from "next-intl";
import InsightsHeader from "@/features/insights/InsightsHeader";
import PredictionsGrid from "@/features/insights/PredictionsGrid";
import NetWorthChart from "@/features/insights/NetWorthChart";
import AllocationDrift from "@/features/insights/AllocationDrift";
import BudgetOverview from "@/features/insights/BudgetOverview";
import SpendingHeatmap from "@/features/insights/SpendingHeatmap";

const Insights = () => {
  const t = useTranslations("Insights");
  const { netWorth, spendingHeatmap, predictions, allocationDrift, loading } =
    useInsights();
  const { budget } = useBudget();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  const totalBudget = budget?.reduce((s, b) => s + b.cap, 0) || 0;
  const totalSpent = budget?.reduce((s, b) => s + b.spent, 0) || 0;

  return (
    <div className="space-y-6">
      <InsightsHeader />

      <PredictionsGrid predictions={predictions || []} />

      <NetWorthChart netWorth={netWorth || []} />

      <div className="grid gap-6 md:grid-cols-2">
        <AllocationDrift allocationDrift={allocationDrift || []} />
        <BudgetOverview
          budget={budget || []}
          totalSpent={totalSpent}
          totalBudget={totalBudget}
        />
      </div>

      <SpendingHeatmap heatmap={spendingHeatmap || []} />
    </div>
  );
};

export default Insights;
