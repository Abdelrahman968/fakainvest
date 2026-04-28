import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SimulatePurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: string;
  onMerchantChange: (merchant: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onSimulate: () => void;
  busy: boolean;
}

export default function SimulatePurchaseSheet({
  open,
  onOpenChange,
  merchant,
  onMerchantChange,
  amount,
  onAmountChange,
  onSimulate,
  busy,
}: SimulatePurchaseSheetProps) {
  const t = useTranslations("WalletPage");
  const quickAmounts = [100, 250, 500, 1000];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-glow" />
            {t("simulateCardPurchase")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-5">
          <p className="rounded-xl bg-secondary/40 p-3 text-[11px] text-muted-foreground">
            {t("simulateDescription")}
          </p>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("merchant")}
            </p>
            <Input
              value={merchant}
              onChange={(e) => onMerchantChange(e.target.value)}
              maxLength={40}
              className="h-11 rounded-2xl"
            />
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
            onClick={onSimulate}
            disabled={busy}
            className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("authorizePurchase")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
