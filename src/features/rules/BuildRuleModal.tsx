"use client";

import { useState } from "react";
import { X, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const triggerOptions = [
  { id: "Uber ride", emoji: "🚗" },
  { id: "Coffee purchase", emoji: "☕" },
  { id: "Salary received", emoji: "💰" },
  { id: "Friday shopping", emoji: "🛍️" },
  { id: "Weekend", emoji: "📅" },
];

const actionOptions = [
  { id: "+5 EGP into EGX30 stocks", emoji: "📈" },
  { id: "+10 EGP into Gold", emoji: "🪙" },
  { id: "Save 10% into Savings Cert", emoji: "🏦" },
  { id: "Block transaction", emoji: "🚫" },
  { id: "Notify Gemini", emoji: "🔔" },
];

interface BuildRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRule: (
    triggerText: string,
    actionText: string,
    triggerEmoji: string,
    actionEmoji: string,
  ) => Promise<void>;
}

export default function BuildRuleModal({
  isOpen,
  onClose,
  onCreateRule,
}: BuildRuleModalProps) {
  const t = useTranslations("Rules");
  const [trigger, setTrigger] = useState<{ id: string; emoji: string } | null>(
    null,
  );
  const [action, setAction] = useState<{ id: string; emoji: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!trigger || !action) return;
    setIsSubmitting(true);
    await onCreateRule(trigger.id, action.id, trigger.emoji, action.emoji);
    setIsSubmitting(false);
    setTrigger(null);
    setAction(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-[600px] overflow-y-scroll max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-elegant sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{t("buildRule")}</h3>
          <button
            onClick={() => !isSubmitting && onClose()}
            className="rounded-full bg-secondary p-2"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary-glow">
          {t("whenThisHappens")}
        </p>
        <div className="mb-5 space-y-2">
          {triggerOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => !isSubmitting && setTrigger(t)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                trigger?.id === t.id
                  ? "border-primary-glow bg-secondary"
                  : "border-border bg-card/60",
              )}
              disabled={isSubmitting}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-sm font-medium">{t.id}</span>
            </button>
          ))}
        </div>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-accent">
          {t("thenDoThis")}
        </p>
        <div className="mb-6 space-y-2">
          {actionOptions.map((a) => (
            <button
              key={a.id}
              onClick={() => !isSubmitting && setAction(a)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                action?.id === a.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card/60",
              )}
              disabled={isSubmitting}
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="text-sm font-medium">{a.id}</span>
            </button>
          ))}
        </div>

        <Button
          disabled={!trigger || !action || isSubmitting}
          onClick={handleSubmit}
          className="w-full gap-2 bg-gradient-accent shadow-glow"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          {t("activateRule")}
        </Button>
      </div>
    </div>
  );
}
