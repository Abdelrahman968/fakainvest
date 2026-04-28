import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { PaymentRequestType } from "@/types/Wallet.types";

interface PaymentRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: PaymentRequestType[];
  processingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const fmt = (n: number | string) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 2 });

export default function PaymentRequestsDialog({
  open,
  onOpenChange,
  requests,
  processingId,
  onAccept,
  onReject,
}: PaymentRequestsDialogProps) {
  const t = useTranslations("WalletPage");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-glow" />
            {t("paymentRequests")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          {requests.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {t("noPendingRequests")}
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                className="rounded-2xl border border-border/40 bg-card/40 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{req.requesterName}</p>
                    <p className="mt-1 text-2xl font-bold text-primary-glow">
                      EGP {fmt(req.amount)}
                    </p>
                    {req.note && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("note")}: {req.note}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {t("requested")}{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAccept(req._id)}
                      disabled={processingId === req._id}
                      className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {processingId === req._id ? (
                        <Loader2 className="h-3 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-4" />
                      )}
                      {t("pay")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(req._id)}
                      disabled={processingId === req._id}
                      className="gap-1"
                    >
                      <XCircle className="h-3 w-4" />
                      {t("reject")}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
