import { Wifi, Snowflake } from "lucide-react";
import { useTranslations } from "next-intl";

interface VirtualCardProps {
  cardNumber: string;
  cardFull: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv?: string;
  frozen: boolean;
  showDetails: boolean;
}

export default function VirtualCard({
  cardNumber,
  cardFull,
  cardHolder,
  cardExpiry,
  cardCvv,
  frozen,
  showDetails,
}: VirtualCardProps) {
  const t = useTranslations("WalletPage");

  return (
    <div
      className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-3xl p-5 shadow-elegant transition-all ${
        frozen ? "opacity-60 grayscale" : ""
      }`}
      style={{
        background:
          "linear-gradient(135deg, hsl(220 60% 18%) 0%, hsl(199 89% 35%) 50%, hsl(45 90% 50%) 130%)",
      }}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-glow/25 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-base font-bold">FakaInvest</p>
            <p className="text-[10px] uppercase tracking-wide opacity-60">
              {t("virtual")}
            </p>
          </div>
          <Wifi className="h-5 w-5 rotate-90 opacity-70" />
        </div>
        {/* Chip */}
        <div className="h-6 w-9 rounded-[4px] bg-linear-to-br from-yellow-200 to-yellow-500 opacity-90" />
        <div>
          <p className="font-mono text-base font-semibold tracking-widest md:text-lg">
            {showDetails ? cardFull : cardNumber}
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase opacity-60">
                {t("cardHolder")}
              </p>
              <p className="text-xs font-semibold">{cardHolder}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase opacity-60">{t("expires")}</p>
              <p className="text-xs font-semibold">{cardExpiry}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase opacity-60">CVV</p>
              <p className="text-xs font-semibold">
                {showDetails ? cardCvv || "428" : "•••"}
              </p>
            </div>
            <span className="font-display text-sm italic font-bold">
              mastercard
            </span>
          </div>
        </div>
      </div>
      {frozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-semibold">
            <Snowflake className="h-4 w-4 text-primary-glow" />
            {t("cardFrozen")}
          </div>
        </div>
      )}
    </div>
  );
}
