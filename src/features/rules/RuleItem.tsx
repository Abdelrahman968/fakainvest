"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Rule } from "@/hooks/useRules";
import { Switch } from "@/components/ui/switch";

interface RuleItemProps {
  rule: Rule;
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
}

export default function RuleItem({ rule, onToggle, onRemove }: RuleItemProps) {
  const t = useTranslations("Rules");

  return (
    <li className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 text-sm flex-wrap">
          <div className="flex items-center gap-1.5 rounded-xl bg-secondary px-2.5 py-1.5">
            <span>{rule.trigger_emoji}</span>
            <span className="text-xs font-medium">{rule.trigger_text}</span>
          </div>
          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          <div className="flex items-center gap-1.5 rounded-xl bg-accent/15 px-2.5 py-1.5">
            <span>{rule.action_emoji}</span>
            <span className="text-xs font-medium text-accent">
              {rule.action_text}
            </span>
          </div>
        </div>

        <Switch
          checked={rule.enabled}
          onCheckedChange={(checked) => onToggle(rule.id, checked)}
        />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
        <p className="text-[11px] text-muted-foreground">
          {t("triggeredCount", { count: rule.triggered_count })}
        </p>
        <button
          onClick={() => onRemove(rule.id)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" /> {t("remove")}
        </button>
      </div>
    </li>
  );
}
