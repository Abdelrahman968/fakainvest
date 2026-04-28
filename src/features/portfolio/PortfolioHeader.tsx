"use client";

import { useTranslations } from "next-intl";

interface PortfolioHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function PortfolioHeader({
  title = "holdings",
  subtitle = "your_portfolio",
}: PortfolioHeaderProps) {
  const t = useTranslations("Portfolio");
  return (
    <header>
      <p className="text-sm text-muted-foreground">{t(subtitle)}</p>
      <h1 className="font-display text-3xl font-bold">{t(title)}</h1>
    </header>
  );
}
