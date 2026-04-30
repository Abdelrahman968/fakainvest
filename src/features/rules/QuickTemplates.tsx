"use client";

import { useTranslations } from "next-intl";

const ruleTemplates = [
  {
    trigger: "Every coffee",
    action: "+10 EGP to Gold",
    emoji: "☕→🪙",
    triggerText: "Coffee purchase",
    actionText: "+10 EGP into Gold",
    triggerEmoji: "☕",
    actionEmoji: "🪙",
  },
  {
    trigger: "Every Uber",
    action: "+5 EGP to Stocks",
    emoji: "🚗→📈",
    triggerText: "Uber ride",
    actionText: "+5 EGP into EGX30 stocks",
    triggerEmoji: "🚗",
    actionEmoji: "📈",
  },
  {
    trigger: "Every payday",
    action: "Auto-save 10%",
    emoji: "💰→🏦",
    triggerText: "Salary received",
    actionText: "Save 10% into Savings Cert",
    triggerEmoji: "💰",
    actionEmoji: "🏦",
  },
];

interface QuickTemplatesProps {
  onCreateFromTemplate: (
    triggerText: string,
    actionText: string,
    triggerEmoji: string,
    actionEmoji: string,
  ) => Promise<void>;
}

export default function QuickTemplates({
  onCreateFromTemplate,
}: QuickTemplatesProps) {
  const t = useTranslations("Rules");

  return (
    <div>
      <h2 className="mb-3 font-display font-semibold">{t("quickTemplates")}</h2>
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-2 pb-1">
          {ruleTemplates.map((template) => (
            <button
              key={template.trigger}
              onClick={() =>
                onCreateFromTemplate(
                  template.triggerText,
                  template.actionText,
                  template.triggerEmoji,
                  template.actionEmoji,
                )
              }
              className="min-w-[170px] shrink-0 rounded-2xl border border-border bg-card/60 p-3 text-left transition-all hover:border-primary-glow"
            >
              <p className="text-center text-lg">{template.emoji}</p>
              <p className="mt-1 text-xs font-semibold">{template.trigger}</p>
              <p className="text-[10px] text-muted-foreground">
                {template.action}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
