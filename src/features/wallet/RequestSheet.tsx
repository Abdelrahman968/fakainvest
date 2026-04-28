import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowDownLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import RecipientSearch from "./RecipientSearch";
import { SearchUser } from "@/types/Wallet.types";

interface RequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: SearchUser[];
  requestTo: string;
  requestToName: string;
  onSelectRecipient: (id: string, name: string) => void;
  requestAmount: string;
  onRequestAmountChange: (amount: string) => void;
  requestNote: string;
  onRequestNoteChange: (note: string) => void;
  onRequest: () => void;
  busy: boolean;
}

export default function RequestSheet({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  requestTo,
  requestToName,
  onSelectRecipient,
  requestAmount,
  onRequestAmountChange,
  requestNote,
  onRequestNoteChange,
  onRequest,
  busy,
}: RequestSheetProps) {
  const t = useTranslations("WalletPage");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-accent" />
            {t("requestMoney")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-5">
          <RecipientSearch
            value={searchQuery}
            onValueChange={onSearchQueryChange}
            searchResults={searchResults}
            onSelect={onSelectRecipient}
            selectedId={requestTo}
            selectedName={requestToName}
            label={t("searchRecipient")}
          />
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("amountEGP")}
            </p>
            <Input
              type="number"
              inputMode="decimal"
              value={requestAmount}
              onChange={(e) => onRequestAmountChange(e.target.value)}
              placeholder="0.00"
              className="h-14 rounded-2xl text-center font-display text-2xl font-bold"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("noteOptional")}
            </p>
            <Input
              value={requestNote}
              onChange={(e) => onRequestNoteChange(e.target.value)}
              placeholder={t("notePlaceholder")}
              className="h-11 rounded-2xl"
            />
          </div>
          <Button
            onClick={onRequest}
            disabled={busy || !requestTo || !requestAmount}
            className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("sendRequest")
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
