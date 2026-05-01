"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, Loader2, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ReferralData {
  code: string;
  referrerName: string;
  rewardAmount: number;
}

export default function ReferralLandingPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("ReferralLanding");
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const code = params?.code as string;

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await fetch(`/api/referral/validate?code=${code}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setReferralData({
            code: data.code,
            referrerName: data.referrerName || t("friend"),
            rewardAmount: data.rewardAmount || 50,
          });

          // Store referral code in localStorage AND sessionStorage
          localStorage.setItem("referralCode", code);
          sessionStorage.setItem("referralCode", code);
          console.log("Stored referral code:", code);
        } else {
          setError(data.error || t("invalidCode"));
        }
      } catch {
        setError(t("networkError"));
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchReferral();
    }
  }, [code, t]);

  const handleSignup = () => {
    // Store code again before navigation
    localStorage.setItem("referralCode", code);
    sessionStorage.setItem("referralCode", code);
    console.log("Navigating to signup with code:", code);

    // Navigate to signup with code in URL
    router.push(`/auth?from=/dashboard&ref=${code}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background to-secondary/30 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
        <p className="mt-4 text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (error || !referralData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background to-secondary/30 p-4">
        <div className="glass-card max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
            <Gift className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold">
            {t("invalidTitle")}
          </h1>
          <p className="mb-6 text-muted-foreground">
            {error || t("invalidCode")}
          </p>
          <Link href="/">
            <Button className="rounded-2xl bg-gradient-accent shadow-glow">
              {t("goHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/30">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-md">
          <div className="animate-bounce">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-accent shadow-glow">
              <Gift className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t("title", { name: referralData.referrerName })}
          </h1>

          <p className="mb-6 text-muted-foreground">
            {t("subtitle", { amount: referralData.rewardAmount })}
          </p>

          <div className="mb-8 space-y-3 text-left">
            {[
              {
                emoji: "💰",
                text: t("benefit1", { amount: referralData.rewardAmount }),
              },
              { emoji: "📈", text: t("benefit2") },
              { emoji: "🎯", text: t("benefit3") },
              { emoji: "🤖", text: t("benefit4") },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl bg-card/40 p-3 backdrop-blur"
              >
                <span className="text-2xl">{benefit.emoji}</span>
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSignup}
              className="h-12 w-full rounded-2xl bg-gradient-accent font-semibold shadow-glow transition-all hover:scale-[1.02]"
            >
              {t("claimBonus")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              {t("terms")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 bg-card/30 py-8">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center font-display text-xl font-semibold">
            {t("whyJoin")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                emoji: "🏦",
                title: t("feature1Title"),
                desc: t("feature1Desc"),
              },
              {
                emoji: "🤖",
                title: t("feature2Title"),
                desc: t("feature2Desc"),
              },
              {
                emoji: "🎯",
                title: t("feature3Title"),
                desc: t("feature3Desc"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-card/40 p-4 text-center backdrop-blur"
              >
                <span className="mb-2 inline-block text-3xl">
                  {feature.emoji}
                </span>
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
