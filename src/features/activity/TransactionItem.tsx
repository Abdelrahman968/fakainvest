import {
  Coffee,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/hooks/useTransactions";

const renderIcon = (category: string, className: string) => {
  const iconProps = { className, size: 20 };

  switch (category) {
    case "Coffee":
      return <Coffee {...iconProps} />;
    case "Transport":
      return <Car {...iconProps} />;
    case "Shopping":
      return <ShoppingBag {...iconProps} />;
    case "Bills":
      return <Receipt {...iconProps} />;
    case "Entertainment":
      return <Tv {...iconProps} />;
    case "Food":
      return <UtensilsCrossed {...iconProps} />;
    default:
      return <Coffee {...iconProps} />;
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onInvest: (id: string) => void;
}

export default function TransactionItem({
  transaction,
  onInvest,
}: TransactionItemProps) {
  const isPending = transaction.status === "Pending";

  return (
    <li className="glass-card flex items-center gap-3 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
        {renderIcon(transaction.category, "h-5 w-5 text-primary-glow")}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{transaction.merchant}</p>
          <span
            className={cn(
              "stat-pill text-[10px]",
              !isPending
                ? "bg-accent/15 text-accent"
                : "bg-warning/15 text-warning",
            )}
          >
            {transaction.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(transaction.date)} · EGP {transaction.amount.toFixed(2)}
        </p>
      </div>

      <div className="text-right">
        <p className="font-display font-bold text-accent">
          +{transaction.roundUp.toFixed(2)}
        </p>
        {isPending && (
          <button
            onClick={() => onInvest(transaction.id)}
            className="text-[10px] font-semibold text-primary-glow hover:underline"
          >
            Invest now
          </button>
        )}
      </div>
    </li>
  );
}
