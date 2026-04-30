"use client";

import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  MapPin,
  Users,
  Building2,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useProperties, type Property } from "@/hooks/useProperties";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

const fmt = (n: number) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });

const RealEstate = () => {
  const t = useTranslations("RealEstate");
  const locale = useLocale();

  const { properties, loading, sharesOwned, buyShares } = useProperties();
  const { wallet } = useWallet();
  const [filter, setFilter] = useState<"All" | Property["type"]>("All");
  const [selected, setSelected] = useState<Property | null>(null);
  const [shares, setShares] = useState(1);
  const [buying, setBuying] = useState(false);

  const filtered = properties.filter(
    (p) => filter === "All" || p.type === filter,
  );

  const totalOwned = properties.reduce(
    (s, p) => s + sharesOwned(p._id) * Number(p.share_price),
    0,
  );

  const monthlyIncome = properties.reduce(
    (s, p) =>
      s +
      (sharesOwned(p._id) * Number(p.share_price) * Number(p.yield_pct)) /
        100 /
        12,
    0,
  );

  const filters: ("All" | Property["type"])[] = [
    "All",
    "Residential",
    "Commercial",
    "Vacation",
    "Office",
  ];

  const confirm = async () => {
    if (!selected) return;
    setBuying(true);
    const r = await buyShares(selected._id, shares);
    setBuying(false);
    if (r.ok === false) return toast.error(r.reason);
    toast.success(
      t("buySuccess", {
        shares: shares,
        name: selected.name,
      }),
      {
        description: t("investedAmount", {
          amount: fmt(shares * Number(selected.share_price)),
        }),
      },
    );
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/more"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60"
        >
          {locale === "ar" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        </div>
      </header>

      <section className="glass-card p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("propertyValue")}
            </p>
            <p className="font-display text-2xl font-bold">
              EGP {fmt(totalOwned)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("monthlyIncome")}
            </p>
            <p className="font-display text-2xl font-bold gradient-text">
              +EGP {fmt(monthlyIncome)}
            </p>
          </div>
        </div>
        {wallet && (
          <p className="mt-3 text-[11px] text-muted-foreground">
            {t("walletBalance")}:{" "}
            <span className="font-semibold text-foreground">
              EGP {fmt(Number(wallet.balance))}
            </span>
          </p>
        )}
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === f
                ? "border-primary-glow bg-primary-glow/15 text-primary-glow"
                : "border-border/60 bg-card/40 text-muted-foreground"
            }`}
          >
            {f === "All" ? t("all") : t(f.toLowerCase())}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {filtered.map((p) => {
          const owned = sharesOwned(p._id);
          const ownedPct = (owned / p.total_shares) * 100;
          const fundedPct =
            ((p.total_shares - p.shares_available) / p.total_shares) * 100;
          return (
            <li key={p._id}>
              <button
                onClick={() => {
                  setSelected(p);
                  setShares(1);
                }}
                className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card/70 text-left transition-all hover:border-primary-glow/50"
              >
                <div
                  className="relative h-32 w-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(${p.color} / 0.4), hsl(${p.color} / 0.15))`,
                  }}
                >
                  <span className="absolute left-4 top-4 text-5xl">
                    {p.emoji}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">
                    {t(p.type.toLowerCase())}
                  </span>
                  {owned > 0 && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-accent/20 px-2.5 py-1 text-[10px] font-semibold text-accent">
                      {t("youOwn")} {ownedPct.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-display font-semibold">{p.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {p.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary/40 p-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground">
                        {t("yield")}
                      </p>
                      <p className="font-display text-sm font-bold text-accent">
                        {p.yield_pct}%
                      </p>
                    </div>
                    <div className="border-x border-border/40">
                      <p className="text-[10px] uppercase text-muted-foreground">
                        {t("appreciation")}
                      </p>
                      <p className="font-display text-sm font-bold gradient-text">
                        +{p.appreciation_1y}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground">
                        {t("occupancy")}
                      </p>
                      <p className="font-display text-sm font-bold">
                        {p.occupancy}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("from")}{" "}
                        <span className="font-semibold text-foreground">
                          EGP {fmt(p.share_price)}
                        </span>
                        /{t("share")}
                      </span>
                      <span className="text-muted-foreground">
                        {fundedPct.toFixed(0)}% {t("funded")}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${fundedPct}%`,
                          background: `hsl(${p.color})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-border/60 max-h-[88vh] overflow-y-auto"
        >
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-3 font-display text-xl">
                    <span className="text-3xl">{selected.emoji}</span>
                    {selected.name}
                  </SheetTitle>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {selected.location} ·{" "}
                  {t(selected.type.toLowerCase())}
                </p>
              </SheetHeader>

              <div className="mt-4 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/40 p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {t("totalValue")}
                    </p>
                    <p className="font-display font-bold">
                      EGP {fmt(selected.total_value)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {t("annualYield")}
                    </p>
                    <p className="font-display font-bold text-accent">
                      {selected.yield_pct}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {t("capitalGrowth")}
                    </p>
                    <p className="font-display font-bold gradient-text">
                      +{selected.appreciation_1y}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {t("occupancy")}
                    </p>
                    <p className="font-display font-bold">
                      {selected.occupancy}%
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{t("buyShares")}</p>
                    <p className="text-xs text-muted-foreground">
                      <Users className="mr-1 inline h-3 w-3" />
                      {fmt(selected.shares_available)} {t("available")}
                    </p>
                  </div>
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="font-display text-3xl font-bold">
                      {shares}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("shareCount", { count: shares })}
                    </span>
                  </div>
                  <Slider
                    value={[shares]}
                    onValueChange={(v) => setShares(v[0])}
                    min={1}
                    max={Math.min(50, selected.shares_available)}
                    step={1}
                  />
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-glow/10 p-3">
                    <span className="text-xs text-muted-foreground">
                      {t("totalCost")}
                    </span>
                    <span className="font-display text-lg font-bold gradient-text">
                      EGP {fmt(shares * Number(selected.share_price))}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {t("estMonthlyIncome")}
                    </span>
                    <span className="font-semibold text-accent">
                      +EGP{" "}
                      {fmt(
                        (shares *
                          Number(selected.share_price) *
                          Number(selected.yield_pct)) /
                          100 /
                          12,
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  disabled={buying}
                  className="h-12 w-full rounded-2xl bg-gradient-accent font-display text-base font-semibold shadow-glow"
                  onClick={confirm}
                >
                  {buying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" /> {t("confirmInvestment")}
                    </>
                  )}
                </Button>

                <p className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {t("disclaimer")}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RealEstate;
