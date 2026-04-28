import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send, Loader2 } from "lucide-react";
import { _Translator } from "next-intl";

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface SendSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  sendAmount: string;
  onSendAmountChange: (amount: string) => void;
  onSend: () => void;
  busy: boolean;
  t: _Translator;
}

export default function SendSheet({
  open,
  onOpenChange,
  selectedContact,
  sendAmount,
  onSendAmountChange,
  onSend,
  busy,
  t,
}: SendSheetProps) {
  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Send className="h-5 w-5 text-primary-glow" />
            {t("sendTo", { name: selectedContact?.name || "" })}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {t("amountEGP")}
            </p>
            <Input
              type="number"
              value={sendAmount}
              onChange={(e) => onSendAmountChange(e.target.value)}
              placeholder="0.00"
              className="h-14 rounded-2xl text-center text-2xl font-bold"
            />
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
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
          </div>
          <Button
            onClick={onSend}
            disabled={busy || !sendAmount}
            className="h-12 w-full rounded-2xl bg-gradient-accent"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("sendNow")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
