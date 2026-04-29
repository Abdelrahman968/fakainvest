"use client";

import { useWallet } from "@/hooks/useWallet";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import TransactionsHeader from "@/features/transactions//TransactionsHeader";
import StatsCards from "@/features/transactions//StatsCards";
import SearchFilter from "@/features/transactions//SearchFilter";
import TransactionItem from "@/features/transactions//TransactionItem";
import EmptyState from "@/features/transactions//EmptyState";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { exportToCSV } from "@/utils/exportCSV";

type Filt = "all" | "in" | "out";

const TransactionsPage = () => {
  const t = useTranslations("Transactions");
  const { transfers, loading } = useWallet();

  const { filtered, totals, grouped, q, setQ, filt, setFilt } =
    useFilteredTransactions(transfers);

  const handleExport = () => {
    exportToCSV(filtered);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <TransactionsHeader onExport={handleExport} />

      <StatsCards moneyIn={totals.inn} moneyOut={totals.out} net={totals.net} />

      <SearchFilter
        searchQuery={q}
        onSearchChange={setQ}
        filterValue={filt as string}
        onFilterChange={(value) => setFilt(value as Filt)}
      />

      {grouped.length === 0 ? (
        <EmptyState />
      ) : (
        grouped.map(([day, items]) => (
          <section key={day} className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {day}
            </p>
            <ul className="space-y-2">
              {items.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
};

export default TransactionsPage;
