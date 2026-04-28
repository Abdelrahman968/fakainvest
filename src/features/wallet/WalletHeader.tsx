import { Bell, Copy, Send, Plus, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface WalletHeaderProps {
  balance: number;
  paymentRequestsCount: number;
  onViewRequests: () => void;
  onSend: () => void;
  onRequest: () => void;
  onDeposit: () => void;
  userId: string;
}

export default function WalletHeader({
  balance,
  paymentRequestsCount,
  onViewRequests,
  onSend,
  onRequest,
  onDeposit,
  userId,
}: WalletHeaderProps) {
  const t = useTranslations("WalletPage");

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/pay/${userId}`);
    toast.success(t("paymentLinkCopied"));
  };

  const fmt = (n: number | string) =>
    Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-primary-glow/30 p-6"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Left — balance */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/60">
              {t("availableBalance")}
            </p>
            <p className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
              EGP {fmt(balance)}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/50">
              {t("instantZeroFees")}
            </p>
          </div>
          {paymentRequestsCount > 0 && (
            <button
              onClick={onViewRequests}
              className="relative ml-2 rounded-full bg-primary-glow/20 p-2.5 backdrop-blur transition-colors hover:bg-primary-glow/30"
            >
              <Bell className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {paymentRequestsCount}
              </span>
            </button>
          )}
        </div>

        {/* Right — action buttons */}
        <div className="grid grid-cols-4 gap-2 md:flex md:gap-3">
          {[
            {
              label: t("send"),
              icon: <Send className="h-4 w-4" />,
              onClick: onSend,
              accent: true,
            },
            {
              label: t("request"),
              icon: <ArrowDownLeft className="h-4 w-4" />,
              onClick: onRequest,
              accent: false,
            },
            {
              label: t("deposit"),
              icon: <Plus className="h-4 w-4" />,
              onClick: onDeposit,
              accent: false,
            },
            {
              label: t("copyLink"),
              icon: <Copy className="h-4 w-4" />,
              onClick: copyPaymentLink,
              accent: false,
            },
          ].map(({ label, icon, onClick, accent }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 text-primary-foreground transition-all md:flex-row md:gap-2 md:px-5 ${
                accent
                  ? "bg-primary-glow/25 ring-1 ring-primary-glow/50 hover:bg-primary-glow/35"
                  : "bg-background/20 hover:bg-background/35"
              }`}
            >
              {icon}
              <span className="text-[11px] font-semibold md:text-xs hidden md:block">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
