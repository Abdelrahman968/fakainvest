import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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

export const CardLimitsSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
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

  if (!draft) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const set = <K extends keyof LimitsDraft>(k: K, v: LimitsDraft[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async () => {
    if (draft.per_transaction_limit > draft.daily_limit) {
      toast.error("Per-transaction limit can't exceed daily limit");
      return;
    }
    if (draft.daily_limit > draft.monthly_limit) {
      toast.error("Daily limit can't exceed monthly limit");
      return;
    }
    setSaving(true);
    await updateLimits(draft);
    setSaving(false);
    toast.success("Card limits updated", {
      description: "Enforced on every card transaction",
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
      label: "Online payments",
      desc: "E-commerce & subscriptions",
      icon: ShoppingBag,
    },
    {
      key: "contactless_enabled",
      label: "Contactless / NFC",
      desc: "Tap to pay",
      icon: Wifi,
    },
    {
      key: "international_enabled",
      label: "International",
      desc: "Outside Egypt",
      icon: Globe,
    },
    {
      key: "atm_enabled",
      label: "ATM withdrawals",
      desc: "Cash advances",
      icon: Landmark,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-3xl border-border/60"
      >
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-glow" />
            Card limits & controls
          </SheetTitle>
        </SheetHeader>

        <div className="mt-5 space-y-6">
          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Daily spend limit
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.daily_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">500 – 20,000</p>
            </div>
            <Slider
              value={[draft.daily_limit]}
              min={500}
              max={20000}
              step={100}
              onValueChange={([v]) => set("daily_limit", v)}
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Monthly spend limit
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.monthly_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                5,000 – 200,000
              </p>
            </div>
            <Slider
              value={[draft.monthly_limit]}
              min={5000}
              max={200000}
              step={500}
              onValueChange={([v]) => set("monthly_limit", v)}
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Per-transaction cap
                </p>
                <p className="font-display text-2xl font-bold">
                  EGP {fmt(draft.per_transaction_limit)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">100 – 10,000</p>
            </div>
            <Slider
              value={[draft.per_transaction_limit]}
              min={100}
              max={10000}
              step={50}
              onValueChange={([v]) => set("per_transaction_limit", v)}
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
              "Save limits"
            )}
          </Button>
          <p className="pb-2 text-center text-[10px] text-muted-foreground">
            Changes apply instantly to your virtual card.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
