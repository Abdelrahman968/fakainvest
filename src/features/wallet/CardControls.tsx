import { Eye, EyeOff, Copy, Snowflake, Lock, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface CardControlsProps {
  showDetails: boolean;
  onToggleDetails: () => void;
  cardFull: string;
  frozen: boolean;
  onToggleFreeze: () => void;
  onOpenLimits: () => void;
}

export default function CardControls({
  showDetails,
  onToggleDetails,
  cardFull,
  frozen,
  onToggleFreeze,
  onOpenLimits,
}: CardControlsProps) {
  const t = useTranslations("WalletPage");

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardFull);
    toast.success(t("cardNumberCopied"));
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <button
        onClick={onToggleDetails}
        className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 py-3 text-xs font-semibold transition-colors hover:bg-secondary"
      >
        {showDetails ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
        {showDetails ? t("hide") : t("show")}
      </button>
      <button
        onClick={copyCardNumber}
        className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 py-3 text-xs font-semibold transition-colors hover:bg-secondary"
      >
        <Copy className="h-3.5 w-3.5" />
        {t("copy")}
      </button>
      <button
        onClick={onToggleFreeze}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 text-xs font-semibold transition-colors ${
          frozen
            ? "border-primary-glow bg-primary-glow/15 text-primary-glow"
            : "border-border/60 bg-card/60 hover:bg-secondary"
        }`}
      >
        {frozen ? (
          <Lock className="h-3.5 w-3.5" />
        ) : (
          <Snowflake className="h-3.5 w-3.5" />
        )}
        {frozen ? t("unfreeze") : t("freeze")}
      </button>
      <button
        onClick={onOpenLimits}
        className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 py-3 text-xs font-semibold transition-colors hover:bg-secondary"
      >
        <Settings2 className="h-3.5 w-3.5" />
        {t("limits")}
      </button>
    </div>
  );
}
