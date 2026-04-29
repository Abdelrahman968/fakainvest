"use client";

import { useTranslations } from "next-intl";

interface DashboardHeaderProps {
  displayName: string;
}

export default function DashboardHeader({ displayName }: DashboardHeaderProps) {
  const t = useTranslations("DashboardPage");

  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{t("greeting")}</p>
        <h1 className="font-display text-2xl font-bold">
          {displayName.split(" ")[0] || "User"}
        </h1>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-accent font-display text-lg font-bold text-primary-foreground shadow-glow">
        {displayName.split(" ")[0].charAt(0) || "User"}
      </div>
    </header>
  );
}
