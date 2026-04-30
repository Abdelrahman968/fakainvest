"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Wifi,
  Landmark,
  ShoppingBag,
  Shield,
  Loader2,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const fmt = (n: number) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });

type LimitsDraft = {
  daily_limit: number;
  monthly_limit: number;
  per_transaction_limit: number;
  online_enabled: boolean;
  contactless_enabled: boolean;
  international_enabled: boolean;
  atm_enabled: boolean;
};

interface CardLimitsSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const CardLimitsSheet = ({
  open,
  onOpenChange,
}: CardLimitsSheetProps) => {
  const t = useTranslations("CardLimits");
  const { wallet, updateLimits } = useWallet();
  const [draft, setDraft] = useState<LimitsDraft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && wallet) {
      const timeout = setTimeout(() => {
        setDraft({
          daily_limit: Number(wallet.daily_limit),
          monthly_limit: Number(wallet.monthly_limit),
          per_transaction_limit: Number(wallet.per_transaction_limit),
          online_enabled: wallet.online_enabled,
          contactless_enabled: wallet.contactless_enabled,
          international_enabled: wallet.international_enabled,
          atm_enabled: wallet.atm_enabled,
        });
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [open, wallet]);

  const set = <K extends keyof LimitsDraft>(k: K, v: LimitsDraft[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async () => {
    if (!draft) return;

    if (draft.per_transaction_limit > draft.daily_limit) {
      toast.error(t("errors.perTransactionExceedsDaily"));
      return;
    }
    if (draft.daily_limit > draft.monthly_limit) {
      toast.error(t("errors.dailyExceedsMonthly"));
      return;
    }

    setSaving(true);
    await updateLimits(draft);
    setSaving(false);
    toast.success(t("success.title"), {
      description: t("success.description"),
    });
    onOpenChange(false);
  };

  const toggles: {
    key: keyof LimitsDraft;
    label: string;
    desc: string;
    icon: typeof Globe;
  }[] = [
    {
      key: "online_enabled",
      label: t("toggles.online.label"),
      desc: t("toggles.online.desc"),
      icon: ShoppingBag,
    },
    {
      key: "contactless_enabled",
      label: t("toggles.contactless.label"),
      desc: t("toggles.contactless.desc"),
      icon: Wifi,
    },
    {
      key: "international_enabled",
      label: t("toggles.international.label"),
      desc: t("toggles.international.desc"),
      icon: Globe,
    },
    {
      key: "atm_enabled",
      label: t("toggles.atm.label"),
      desc: t("toggles.atm.desc"),
      icon: Landmark,
    },
  ];

  if (!draft) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
          <VisuallyHidden.Root>
            <SheetTitle>{t("loading")}</SheetTitle>
          </VisuallyHidden.Root>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-3xl border-border/60"
      >
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-glow" />
            {t("title")}
          </SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-6">
          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("limits.daily.label")}
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.daily_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("limits.daily.range")}
              </p>
            </div>
            <Slider
              value={[draft.daily_limit]}
              min={500}
              max={20000}
              step={100}
              onValueChange={([v]) => set("daily_limit", v)}
              aria-label={t("limits.daily.label")}
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("limits.monthly.label")}
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.monthly_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("limits.monthly.range")}
              </p>
            </div>
            <Slider
              value={[draft.monthly_limit]}
              min={5000}
              max={200000}
              step={500}
              onValueChange={([v]) => set("monthly_limit", v)}
              aria-label={t("limits.monthly.label")}
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("limits.perTransaction.label")}
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.per_transaction_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("limits.perTransaction.range")}
              </p>
            </div>
            <Slider
              value={[draft.per_transaction_limit]}
              min={100}
              max={10000}
              step={50}
              onValueChange={([v]) => set("per_transaction_limit", v)}
              aria-label={t("limits.perTransaction.label")}
            />
          </div>

          <ul className="space-y-2">
            {toggles.map(({ key, label, desc, icon: Icon }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5 text-primary-glow" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={draft[key] as boolean}
                  onCheckedChange={(v) => set(key, v as never)}
                  aria-label={label}
                />
              </li>
            ))}
          </ul>

          <Button
            onClick={save}
            disabled={saving}
            className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("saveButton")
            )}
          </Button>

          <p className="pb-2 text-center text-[10px] text-muted-foreground">
            {t("footerNote")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
