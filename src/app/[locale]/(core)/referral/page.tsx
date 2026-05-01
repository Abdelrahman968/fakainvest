"use client";

import { useState } from "react";
import {
  Copy,
  Share2,
  Gift,
  Check,
  MessageCircle,
  Mail,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReferral } from "@/hooks/useReferral";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const fmt = (n: number) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });

const Referral = () => {
  const t = useTranslations("Referral");
  const { referral, signups, link, loading } = useReferral();
  const [copied, setCopied] = useState(false);

  if (loading || !referral) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    toast.success(`${label} ${t("copied")}`);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalReferred = signups.length;
  const pending = signups.filter((s) => s.status === "Pending").length;
  const active = signups.filter((s) => s.status === "Active").length;

  const stats = [
    {
      label: t("totalEarned"),
      value: `EGP ${fmt(Number(referral.total_earned))}`,
      color: "accent",
    },
    { label: t("friendsJoined"), value: totalReferred, color: "primary-glow" },
    { label: t("active"), value: active, color: "accent" },
    { label: t("pending"), value: pending, color: "warning" },
  ];

  return (
    <div className="space-y-6">
      <header className="hidden md:block">
        <p className="text-sm text-muted-foreground">
          {t("earnPerFriend", { amount: referral.reward_per_signup })}
        </p>
        <h2 className="font-display text-2xl font-bold">{t("title")}</h2>
      </header>

      <section
        className="relative overflow-hidden rounded-3xl border border-primary-glow/30 p-6 md:p-8"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/30 backdrop-blur">
              <Gift className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/80">
                {t("bothWin", { amount: referral.reward_per_signup })}
              </p>
              <h1 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
                {t("inviteFriends")}
              </h1>
            </div>
          </div>

          <div className="space-y-3 md:flex md:items-end md:gap-4 md:space-y-0">
            <div className="flex-1">
              <p className="mb-1.5 text-[10px] uppercase tracking-wide text-primary-foreground/70">
                {t("yourCode")}
              </p>
              <div className="flex items-center gap-2 rounded-2xl border border-primary-foreground/30 bg-background/30 p-3 backdrop-blur">
                <span className="flex-1 font-mono text-base font-bold tracking-wide text-primary-foreground md:text-xl">
                  {referral.code}
                </span>
                <button
                  onClick={() => copy(referral.code, t("code"))}
                  className="flex items-center gap-1.5 rounded-full bg-primary-foreground px-3 py-1.5 text-xs font-semibold text-background"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? t("copied") : t("copy")}
                </button>
              </div>
            </div>
            <Button
              onClick={() => copy(link, t("link"))}
              className="w-full rounded-2xl bg-primary-foreground text-background hover:bg-primary-foreground/90 md:w-auto"
            >
              <Share2 className="h-4 w-4" /> {t("shareLink")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              {
                icon: MessageCircle,
                label: "WhatsApp",
                url: `https://wa.me/?text=${encodeURIComponent(`${t("joinMessage")} ${referral.code} ${link}`)}`,
              },
              {
                icon: X,
                label: "X",
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${t("joinMessage")} ${link}`)}`,
              },
              {
                icon: Mail,
                label: "Email",
                url: `mailto:?subject=${t("joinSubject")}&body=${encodeURIComponent(`${t("joinBody")} ${referral.code}: ${link}`)}`,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-background/20 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-background/40"
              >
                <s.icon className="h-3 w-3" /> {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <article key={s.label} className="glass-card p-4 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p
              className="mt-2 font-display text-xl font-bold md:text-2xl"
              style={{ color: `hsl(var(--${s.color}))` }}
            >
              {s.value}
            </p>
          </article>
        ))}
      </section>

      <section className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("friendsInvited")}
            </p>
            <h3 className="font-display text-lg font-semibold">
              {t("yourReferrals")}
            </h3>
          </div>
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            {active} {t("active")}
          </span>
        </div>
        {signups.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {t("noReferrals")}
          </p>
        ) : (
          <ul className="space-y-2">
            {signups.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-3"
              >
                <span className="text-2xl">{r.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("joined")} {r.joined_at}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    r.status === "Active"
                      ? "bg-accent/15 text-accent"
                      : r.status === "Pending"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {r.status === "Active"
                    ? t("active")
                    : r.status === "Pending"
                      ? t("pending")
                      : t("inactive")}
                </span>
                <span className="w-16 text-right font-display text-sm font-bold">
                  {Number(r.earned) > 0 ? `+${r.earned}` : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Referral;
