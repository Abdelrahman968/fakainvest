"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AISuggestionProps {
  onApply: () => void;
}

export default function AISuggestion({ onApply }: AISuggestionProps) {
  const t = useTranslations("Budget");

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary-glow/30 bg-primary-glow/5 p-4">
      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{t("suggestion.title")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("suggestion.description")}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="border-primary-glow text-primary-glow hover:bg-primary-glow/10"
        onClick={onApply}
      >
        {t("suggestion.apply")}
      </Button>
    </div>
  );
}
