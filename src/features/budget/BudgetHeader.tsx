"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface BudgetHeaderProps {
  onAddClick: () => void;
}

export default function BudgetHeader({ onAddClick }: BudgetHeaderProps) {
  const t = useTranslations("Budget");

  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      </div>
      <Button
        onClick={onAddClick}
        size="sm"
        className="gap-1.5 bg-gradient-accent shadow-glow"
      >
        <Plus className="h-4 w-4" /> {t("add")}
      </Button>
    </header>
  );
}
