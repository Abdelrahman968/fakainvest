"use client";

import { useTranslations } from "next-intl";

export default function InsightsHeader() {
  const t = useTranslations("Insights");

  return (
    <header className="hidden md:block">
      <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      <h2 className="font-display text-2xl font-bold">{t("title")}</h2>
    </header>
  );
}
