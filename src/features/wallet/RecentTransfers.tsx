import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Transfer } from "@/types/Wallet.types";

interface RecentTransfersProps {
  transfers: Transfer[];
}

const typeMeta: Record<
  Transfer["type"],
  { labelKey: string; color: string; icon: typeof ArrowUpRight }
> = {
  sent: { labelKey: "sent", color: "destructive", icon: ArrowUpRight },
  received: { labelKey: "received", color: "accent", icon: ArrowDownLeft },
  deposit: { labelKey: "deposit", color: "primary-glow", icon: ArrowDownLeft },
  topup: { labelKey: "topup", color: "primary-glow", icon: ArrowDownLeft },
  card: { labelKey: "card", color: "destructive", icon: ArrowUpRight },
};

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

export default function RecentTransfers({ transfers }: RecentTransfersProps) {
  const t = useTranslations("WalletPage");

  if (transfers.length === 0) {
    return (
      <div className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("allMoneyInOut")}
            </p>
            <h3 className="font-display text-lg font-semibold">
              {t("recentTransfers")}
            </h3>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-primary-glow hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{t("noTransfersYet")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("tryDepositingOrPaying")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("allMoneyInOut")}</p>
          <h3 className="font-display text-lg font-semibold">
            {t("recentTransfers")}
          </h3>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-primary-glow hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      <ul className="space-y-2">
        {transfers.slice(0, 6).map((tItem) => {
          const meta = typeMeta[tItem.type];
          const Icon = meta.icon;
          const isOut = tItem.type === "sent" || tItem.type === "card";
          const typeLabel = t(meta.labelKey);

          return (
            <li
              key={tItem.id}
              className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/40 p-3 transition-all hover:bg-card/60"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{
                  background: `hsl(var(--${meta.color}) / 0.15)`,
                }}
              >
                {tItem.avatar || (isOut ? "📤" : "📥")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {tItem.counterparty}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {typeLabel} · {tItem.method}{" "}
                  {tItem.note ? `· ${tItem.note}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`flex items-center gap-1 font-display font-bold ${isOut ? "text-foreground" : "text-accent"}`}
                >
                  <Icon className="h-3 w-3" />
                  {isOut ? "-" : "+"}EGP {fmt(tItem.amount)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(tItem.created_at).toLocaleDateString("en-EG", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
