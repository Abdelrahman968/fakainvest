import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { _Translator } from "next-intl";
import { UserProfilePay } from "@/types/UserProfilePay";

interface SuccessStateProps {
  amount: string;
  recipient: UserProfilePay;
  t: _Translator;
}

export default function SuccessState({
  amount,
  recipient,
  t,
}: SuccessStateProps) {
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center border-accent/50">
        <CardContent className="pt-6">
          <CheckCircle className="mx-auto h-16 w-16 text-accent" />
          <p className="mt-4 text-xl font-bold">{t("paymentSent")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("sentAmountTo", { amount, name: recipient.displayName })}
          </p>
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link href="/wallet">{t("backToWallet")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contacts">{t("viewContacts")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
