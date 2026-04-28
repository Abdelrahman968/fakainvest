import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onDeposit: () => void;
  busy: boolean;
}

export default function DepositSheet({
  open,
  onOpenChange,
  amount,
  onAmountChange,
  onDeposit,
  busy,
}: DepositSheetProps) {
  const t = useTranslations("WalletPage");
  const quickAmounts = [200, 500, 1000, 2500];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" />
            {t("depositFunds")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-5">
          <div className="rounded-2xl border border-border/40 bg-card/40 p-4 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-primary-glow" />
            <p className="mt-2 text-sm font-semibold">{t("bankTransfer")}</p>
            <p className="text-[11px] text-muted-foreground">
              {t("fundsCreditedInstantly")}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("amountEGP")}
            </p>
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="h-14 rounded-2xl text-center font-display text-2xl font-bold"
            />
            <div className="mt-2 flex justify-center gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => onAmountChange(String(q))}
                  className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  EGP {q}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={onDeposit}
            disabled={busy}
            className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("depositButton", { amount })
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
