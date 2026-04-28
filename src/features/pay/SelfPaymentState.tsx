import { AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { _Translator } from "next-intl";

interface SelfPaymentStateProps {
  onCopyLink: () => void;
  t: _Translator;
}

export default function SelfPaymentState({
  onCopyLink,
  t,
}: SelfPaymentStateProps) {
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-warning" />
          <p className="mt-4 text-lg font-semibold">{t("yourPaymentLink")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("sharePaymentLinkMessage")}
          </p>
          <Button onClick={onCopyLink} className="mt-6 w-full gap-2">
            <Copy className="h-4 w-4" />
            {t("copyPaymentLink")}
          </Button>
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="/wallet">{t("backToWallet")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
