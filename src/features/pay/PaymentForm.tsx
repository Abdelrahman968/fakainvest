import { Send, Loader2, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { _Translator } from "next-intl";
import { UserProfilePay } from "@/types/UserProfilePay";

interface PaymentFormProps {
  recipient: UserProfilePay;
  amount: string;
  onAmountChange: (amount: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  onSend: () => void;
  sending: boolean;
  t: _Translator;
}

export default function PaymentForm({
  recipient,
  amount,
  onAmountChange,
  note,
  onNoteChange,
  onSend,
  sending,
  t,
}: PaymentFormProps) {
  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="text-center border-b border-border/40">
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl">
              {recipient.displayName?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="mt-3 text-2xl">{recipient.displayName}</CardTitle>
        <CardDescription>{recipient.email}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center gap-2 rounded-xl bg-accent/10 p-3 text-xs text-accent">
          <Shield className="h-4 w-4 shrink-0" />
          <span>{t("securePaymentMessage")}</span>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            {t("amountEGP")}
          </label>
          <Input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="h-16 text-center text-3xl font-bold"
            autoFocus
          />
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
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

        <div>
          <label className="mb-2 block text-sm font-medium">
            {t("noteOptional")}
          </label>
          <Input
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={t("notePlaceholder")}
            className="rounded-xl"
            maxLength={100}
          />
        </div>

        <Button
          onClick={onSend}
          disabled={sending || !amount || parseFloat(amount) <= 0}
          className="h-12 w-full gap-2 rounded-xl bg-gradient-accent text-lg font-semibold"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {sending
            ? t("processing")
            : t("sendButton", { amount: amount || "0" })}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {t("instantFreeTransfer")}
        </p>
      </CardContent>
    </Card>
  );
}
