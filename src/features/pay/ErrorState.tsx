import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { _Translator } from "next-intl";

interface ErrorStateProps {
  error: string | null;
  t: _Translator;
}

export default function ErrorState({ error, t }: ErrorStateProps) {
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center">
        <CardContent className="pt-6">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-semibold">
            {error || t("userNotFound")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("invalidLinkMessage")}
          </p>
          <div className="mt-6 space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/wallet">{t("backToWallet")}</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/contacts">{t("viewContacts")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
