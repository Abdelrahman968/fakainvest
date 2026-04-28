import { useTranslations } from "next-intl";

interface CardLimitsProps {
  spentToday: number;
  dailyLimit: number;
  spentThisMonth: number;
  monthlyLimit: number;
  perTransactionLimit: number;
  onlineEnabled: boolean;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  onAdjustLimits: () => void;
  onSimulatePurchase: () => void;
}

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

export default function CardLimits({
  spentToday,
  dailyLimit,
  spentThisMonth,
  monthlyLimit,
  perTransactionLimit,
  onlineEnabled,
  contactlessEnabled,
  internationalEnabled,
  onAdjustLimits,
  onSimulatePurchase,
}: CardLimitsProps) {
  const t = useTranslations("WalletPage");

  const dailyPct = Math.min(100, (spentToday / dailyLimit) * 100);
  const monthlyPct = Math.min(100, (spentThisMonth / monthlyLimit) * 100);
  const dailyNear = dailyPct >= 80;
  const monthlyNear = monthlyPct >= 80;

  return (
    <div className="space-y-3 rounded-2xl border border-border/40 bg-card/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          {t("cardLimits")}
        </p>
        <button
          onClick={onAdjustLimits}
          className="text-[11px] font-semibold text-primary-glow hover:underline"
        >
          {t("adjust")}
        </button>
      </div>

      {/* Daily */}
      <div>
        <div className="mb-1 flex items-end justify-between">
          <p className="text-xs font-medium">{t("daily")}</p>
          <p className="text-[11px] text-muted-foreground">
            EGP {fmt(spentToday)} / {fmt(dailyLimit)}
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
          <div
            className={`h-full rounded-full transition-all ${
              dailyPct >= 100
                ? "bg-destructive"
                : dailyNear
                  ? "bg-warning"
                  : "bg-gradient-accent"
            }`}
            style={{ width: `${dailyPct}%` }}
          />
        </div>
        {dailyNear && dailyPct < 100 && (
          <p className="mt-1 text-[10px] font-semibold text-warning">
            ⚠ {Math.round(100 - dailyPct)}% {t("ofDailyLimitRemaining")}
          </p>
        )}
        {dailyPct >= 100 && (
          <p className="mt-1 text-[10px] font-semibold text-destructive">
            🚫 {t("dailyLimitReached")}
          </p>
        )}
      </div>

      {/* Monthly */}
      <div>
        <div className="mb-1 flex items-end justify-between">
          <p className="text-xs font-medium">{t("monthly")}</p>
          <p className="text-[11px] text-muted-foreground">
            EGP {fmt(spentThisMonth)} / {fmt(monthlyLimit)}
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
          <div
            className={`h-full rounded-full transition-all ${
              monthlyPct >= 100
                ? "bg-destructive"
                : monthlyNear
                  ? "bg-warning"
                  : "bg-gradient-accent"
            }`}
            style={{ width: `${monthlyPct}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold">
          {t("perTx")} ≤ EGP {fmt(perTransactionLimit)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${onlineEnabled ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}
        >
          {t("online")} {onlineEnabled ? t("on") : t("off")}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${contactlessEnabled ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}
        >
          NFC {contactlessEnabled ? t("on") : t("off")}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${internationalEnabled ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}
        >
          {t("intl")} {internationalEnabled ? t("on") : t("off")}
        </span>
      </div>

      <button
        onClick={onSimulatePurchase}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 py-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary-glow hover:text-primary-glow"
      >
        {t("simulateCardPurchase")}
      </button>
    </div>
  );
}
