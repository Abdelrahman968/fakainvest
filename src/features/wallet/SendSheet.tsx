import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import RecipientSearch from "./RecipientSearch";
import { SearchUser } from "@/types/Wallet.types";

interface SendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: SearchUser[];
  sendTo: string;
  sendToName: string;
  onSelectRecipient: (id: string, name: string) => void;
  sendAmount: string;
  onSendAmountChange: (amount: string) => void;
  balance: number;
  onSend: () => void;
  busy: boolean;
}

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

export default function SendSheet({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  sendTo,
  sendToName,
  onSelectRecipient,
  sendAmount,
  onSendAmountChange,
  balance,
  onSend,
  busy,
}: SendSheetProps) {
  const t = useTranslations("WalletPage");
  const quickAmounts = [50, 100, 250, 500];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Send className="h-5 w-5 text-primary-glow" />
            {t("sendMoney")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-5">
          <RecipientSearch
            value={searchQuery}
            onValueChange={onSearchQueryChange}
            searchResults={searchResults}
            onSelect={onSelectRecipient}
            selectedId={sendTo}
            selectedName={sendToName}
            label={t("searchRecipient")}
          />
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("amountEGP")}
            </p>
            <Input
              type="number"
              inputMode="decimal"
              value={sendAmount}
              onChange={(e) => onSendAmountChange(e.target.value)}
              placeholder="0.00"
              className="h-14 rounded-2xl text-center font-display text-2xl font-bold"
            />
            <div className="mt-2 flex justify-center gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => onSendAmountChange(String(q))}
                  className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  EGP {q}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {t("availableBalance")}: EGP {fmt(balance)}
            </p>
          </div>
          <Button
            onClick={onSend}
            disabled={busy || !sendTo || !sendAmount}
            className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("sendInstantly")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
