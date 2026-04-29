"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transfer } from "@/hooks/useWallet";

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

const typeMeta: Record<Transfer["type"], { label: string; tone: string }> = {
  sent: { label: "Sent", tone: "text-foreground" },
  received: { label: "Received", tone: "text-accent" },
  deposit: { label: "Deposit", tone: "text-accent" },
  topup: { label: "Top-up", tone: "text-primary-glow" },
  card: { label: "Card", tone: "text-foreground" },
};

interface TransactionItemProps {
  transaction: Transfer;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isOut = transaction.type === "sent" || transaction.type === "card";
  const Icon = isOut ? ArrowUpRight : ArrowDownLeft;
  const meta = typeMeta[transaction.type];

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/40 p-3">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
          isOut ? "bg-destructive/10" : "bg-accent/10"
        }`}
      >
        {transaction.avatar}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{transaction.counterparty}</p>
        <p className="text-[11px] text-muted-foreground">
          {meta.label} · {transaction.method} · {transaction.note}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`flex items-center gap-1 font-display font-bold ${meta.tone}`}
        >
          <Icon className="h-3 w-3" />
          {isOut ? "-" : "+"}EGP {fmt(transaction.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {new Date(transaction.created_at).toLocaleTimeString("en-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
