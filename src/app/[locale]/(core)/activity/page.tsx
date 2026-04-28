"use client";

import { useTranslations } from "next-intl";
import ActivityHeader from "@/features/activity/ActivityHeader";
import StatsCards from "@/features/activity/StatsCards";
import PendingCard from "@/features/activity/PendingCard";
import CategoryFilter from "@/features/activity/CategoryFilter";
import TransactionList from "@/features/activity/TransactionList";
import { useTransactions } from "@/hooks/useTransactions";

const categories = [
  "All",
  "Food",
  "Coffee",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
];

export default function ActivityPage() {
  const t = useTranslations("Activity");
  const { transactions, loading, filter, setFilter, stats, investNow } =
    useTransactions();

  return (
    <div className="space-y-5 pb-8">
      <ActivityHeader title={t("title")} subtitle={t("subtitle")} />

      <StatsCards
        totalRoundUp={stats.totalRoundUp}
        pendingCount={stats.pendingCount}
        currency="EGP"
        totalLabel={t("totalRoundUp")}
        pendingLabel={t("pending")}
        itemsLabel={t("items")}
      />

      {stats.pendingCount > 0 && (
        <PendingCard
          pendingAmount={stats.pendingAmount}
          pendingCount={stats.pendingCount}
          onInvest={() => investNow()}
          buttonText={t("investNow")}
          description={t("readyToInvest")}
        />
      )}

      <CategoryFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        categories={categories}
      />

      <TransactionList
        transactions={transactions}
        loading={loading}
        onInvest={investNow}
        emptyMessage={t("noTransactions")}
      />
    </div>
  );
}
