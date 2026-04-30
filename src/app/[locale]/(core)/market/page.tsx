"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarket } from "@/hooks/useMarket";
import { useTranslations } from "next-intl";

const offerCategories = [
  "All",
  "Food",
  "Coffee",
  "Transport",
  "Shopping",
  "Bills",
] as const;

const Market = () => {
  const t = useTranslations("Market");
  const { rates, certificates, offers, loading } = useMarket();
  const [tab, setTab] = useState<"rates" | "certs" | "offers">("rates");
  const [filter, setFilter] = useState<(typeof offerCategories)[number]>("All");

  const filteredOffers =
    filter === "All" ? offers : offers.filter((o) => o.category === filter);

  const sortedCerts = [...certificates].sort((a, b) => b.rate - a.rate);
  const bestRate = sortedCerts[0];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-secondary p-1">
        {[
          { k: "rates", l: t("liveRates") },
          { k: "certs", l: t("certificates") },
          { k: "offers", l: t("cashback") },
        ].map((tItem) => (
          <button
            key={tItem.k}
            onClick={() => setTab(tItem.k as typeof tab)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
              tab === tItem.k
                ? "bg-gradient-accent text-primary-foreground shadow-glow"
                : "text-muted-foreground",
            )}
          >
            {tItem.l}
          </button>
        ))}
      </div>

      {/* Live Rates Tab */}
      {tab === "rates" && (
        <ul className="space-y-2">
          {rates.map((r) => {
            const Icon =
              r.change > 0 ? TrendingUp : r.change < 0 ? TrendingDown : Minus;
            const color =
              r.change > 0
                ? "text-accent"
                : r.change < 0
                  ? "text-destructive"
                  : "text-muted-foreground";
            return (
              <li
                key={r._id}
                className="glass-card flex items-center gap-4 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold">
                    {r.value.toLocaleString()}
                  </p>
                  <p
                    className={cn(
                      "flex items-center justify-end gap-1 text-xs font-semibold",
                      color,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {r.change > 0 && "+"}
                    {r.change}%
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Certificates Tab */}
      {tab === "certs" && (
        <div className="space-y-3">
          {bestRate && (
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
              ⚡ {t("bestRateToday")}:{" "}
              <span className="font-bold gold-text">{bestRate.rate}%</span>{" "}
              {t("at")} {bestRate.bank}
            </div>
          )}
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">
                    {t("bank")}
                  </th>
                  <th className="px-2 py-3 text-left font-semibold">
                    {t("term")}
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    {t("rate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCerts.map((c, i) => (
                  <tr
                    key={c._id}
                    className={cn(
                      "border-t border-border/50",
                      i === 0 && "bg-accent/5",
                    )}
                  >
                    <td className="px-3 py-3">
                      <p className="font-display font-bold">{c.bank}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.name}
                      </p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-xs">{c.term}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Min EGP {c.min.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={cn(
                          "font-display font-bold",
                          i === 0 ? "gradient-text text-base" : "",
                        )}
                      >
                        {c.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Offers Tab */}
      {tab === "offers" && (
        <div className="space-y-4">
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <div className="flex gap-2 pb-1">
              {offerCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                    filter === c
                      ? "bg-gradient-accent text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {c === "All" ? t("all") : t(c.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredOffers.map((o) => (
              <div key={o._id} className="glass-card overflow-hidden p-4">
                <div
                  className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: `hsl(${o.color} / 0.15)` }}
                >
                  {o.emoji}
                </div>
                <p className="font-display font-bold">{o.brand}</p>
                <p className="text-[11px] text-muted-foreground">
                  {o.category}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-accent px-3 py-1 text-xs font-bold text-primary-foreground">
                  {o.cashback} {t("back")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
