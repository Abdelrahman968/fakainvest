"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import RulesStats from "@/features/rules/RulesStats";
import QuickTemplates from "@/features/rules/QuickTemplates";
import RulesList from "@/features/rules/RulesList";
import BuildRuleModal from "@/features/rules/BuildRuleModal";

const RulesPage = () => {
  const t = useTranslations("Rules");
  const { rules, loading, toggle, create, remove } = useRules();
  const [building, setBuilding] = useState(false);

  const handleCreateRule = useCallback(
    async (
      triggerText: string,
      actionText: string,
      triggerEmoji: string,
      actionEmoji: string,
    ) => {
      const success = await create(
        triggerText,
        actionText,
        triggerEmoji,
        actionEmoji,
      );
      if (success) {
        toast.success(t("success.activated"));
        setBuilding(false);
      }
    },
    [create, t],
  );

  const totalTriggered = rules.reduce((s, r) => s + r.triggered_count, 0);
  const activeCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        </div>
        <Button
          onClick={() => setBuilding(true)}
          size="sm"
          className="gap-1.5 bg-gradient-accent shadow-glow"
        >
          <Plus className="h-4 w-4" /> {t("newRule")}
        </Button>
      </header>

      <RulesStats activeCount={activeCount} totalTriggered={totalTriggered} />
      <QuickTemplates onCreateFromTemplate={handleCreateRule} />
      <RulesList
        rules={rules}
        loading={loading}
        onToggle={toggle}
        onRemove={remove}
      />
      <BuildRuleModal
        isOpen={building}
        onClose={() => setBuilding(false)}
        onCreateRule={handleCreateRule}
      />
    </div>
  );
};

export default RulesPage;
