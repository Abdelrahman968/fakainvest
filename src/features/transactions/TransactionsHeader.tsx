"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";

interface TransactionsHeaderProps {
  onExport: () => void;
}

const TransactionsHeader = ({ onExport }: TransactionsHeaderProps) => {
  const t = useTranslations("Transactions");

  return (
    <header className="flex items-end justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      </div>
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
      >
        <Download className="h-3.5 w-3.5" />
        {t("exportCsv")}
      </button>
    </header>
  );
};

export default TransactionsHeader;
