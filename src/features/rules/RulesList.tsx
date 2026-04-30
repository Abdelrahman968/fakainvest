"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import RuleItem from "./RuleItem";
import type { Rule } from "@/hooks/useRules";

interface RulesListProps {
  rules: Rule[];
  loading: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
}

export default function RulesList({
  rules,
  loading,
  onToggle,
  onRemove,
}: RulesListProps) {
  const t = useTranslations("Rules");

  if (loading) {
    return (
      <div>
        <h2 className="mb-3 font-display font-semibold">{t("yourRules")}</h2>
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 font-display font-semibold">{t("yourRules")}</h2>
      {rules.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <ul className="space-y-2">
          {rules.map((rule) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
