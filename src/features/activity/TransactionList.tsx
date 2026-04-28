import { Loader2 } from "lucide-react";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "@/hooks/useTransactions";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onInvest: (id: string) => void;
  emptyMessage: string;
}

export default function TransactionList({
  transactions,
  loading,
  onInvest,
  emptyMessage,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onInvest={onInvest}
        />
      ))}
    </ul>
  );
}
