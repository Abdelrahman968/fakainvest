"use client";

import { useTranslations } from "next-intl";

const EmptyState = () => {
  const t = useTranslations("Transactions");

  return (
    <div className="glass-card p-10 text-center text-sm text-muted-foreground">
      {t("noTransactions")}
    </div>
  );
};

export default EmptyState;
