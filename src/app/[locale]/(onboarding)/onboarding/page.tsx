"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Coins,
  PiggyBank,
  Bot,
  Target,
  TrendingUp,
  Award,
  Users,
  Zap,
  LineChart,
  Gem,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type Step = 0 | 1 | 2 | 3 | 4;

const Onboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const t = useTranslations("onboarding");
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(`/${newLocale}/onboarding`);
  };

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);

  const completeOnboarding = async () => {
    document.cookie =
      "onboarding-completed=true; path=/; max-age=" + 60 * 60 * 24 * 365;

    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 py-8 sm:max-w-lg relative">
      <div className="mb-8 flex items-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              i <= step ? "bg-gradient-accent" : "bg-muted",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="flex min-h-[80vh] flex-col justify-between items-center text-center">
          <div>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-accent shadow-glow">
              <Coins className="h-10 w-10 text-primary-foreground" />
            </div>

            <h1 className="mb-3 font-display text-4xl font-bold leading-tight">
              {t("welcomeTo")}
              <span className="gradient-text">
                {t("appName") ||
                  "AI-powered personal finance app for the Arab market"}
              </span>
            </h1>
            <p className="mb-6 text-muted-foreground">{t("aiTitle")}</p>

            <div className="mb-8 space-y-4 text-start">
              <div className="rounded-2xl glass-card p-4">
                <p className="text-sm font-semibold text-primary-glow">
                  {t("coreIdeaTitle")}
                </p>
                <p className="text-sm">{t("coreIdeaDesc")}</p>
              </div>
              <div className="rounded-2xl glass-card p-4">
                <p className="text-sm font-semibold text-primary-glow">
                  {t("targetMarketTitle")}
                </p>
                <p className="text-sm">{t("targetMarketDesc")}</p>
              </div>
              <div className="rounded-2xl glass-card p-4">
                <p className="text-sm font-semibold text-primary-glow">
                  {t("competitiveEdgeTitle")}
                </p>
                <p className="text-sm">{t("competitiveEdgeDesc")}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={next}
            size="lg"
            className="w-full gap-2 bg-gradient-accent shadow-glow hover:opacity-95 cursor-pointer hover:scale-102 transition-all duration-200"
          >
            {t("discoverFeatures")}{" "}
            <ArrowRight
              className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`}
            />
          </Button>

          <Button
            onClick={toggleLanguage}
            variant="ghost"
            className="absolute top-20 inset-s-6 bg-gradient-accent cursor-pointer hover:scale-102 transition-all duration-200"
          >
            {locale === "ar" ? (
              <>
                <span className="text-white font-bold">EN</span>
              </>
            ) : (
              <>
                <span className="text-white font-bold">AR</span>
              </>
            )}
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="min-h-[80vh] flex flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Zap className="h-6 w-6 text-primary-glow" />
            </div>
            <h2 className="mb-2 font-display text-3xl font-bold">
              {t("smartRoundUp")}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t("smartRoundUpDesc")}
            </p>

            <div className="mb-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="p-3 text-start">{t("purchase")}</th>
                    <th className="p-3 text-start">{t("roundedTo")}</th>
                    <th className="p-3 text-start">{t("invested")}</th>
                    <th className="p-3 text-start">{t("mode")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">3 {t("currency")}</td>
                    <td className="p-3">10 {t("currency")}</td>
                    <td className="p-3 font-medium text-primary-glow">
                      7 {t("currency")}
                    </td>
                    <td className="p-3">{t("normal")}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">3 {t("currency")}</td>
                    <td className="p-3">50 {t("currency")}</td>
                    <td className="p-3 font-medium text-primary-glow">
                      47 {t("currency")}
                    </td>
                    <td className="p-3">{t("medium")}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">53 {t("currency")}</td>
                    <td className="p-3">100 {t("currency")}</td>
                    <td className="p-3 font-medium text-primary-glow">
                      47 {t("currency")}
                    </td>
                    <td className="p-3">{t("aggressive")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl bg-primary-glow/10 p-4 text-center border border-primary-glow/30 cursor-pointer hover:scale-102 transition-transform duration-200">
              <p className="text-sm">{t("roundUpModes")}</p>
            </div>
          </div>

          <Button
            onClick={next}
            size="lg"
            className="mt-8 w-full bg-gradient-accent shadow-glow cursor-pointer hover:scale-102 transition-all duration-200"
          >
            {t("nextInvestment")}{" "}
            <ArrowRight
              className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-[80vh] flex flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <TrendingUp className="h-6 w-6 text-primary-glow" />
            </div>
            <h2 className="mb-2 font-display text-3xl font-bold">
              {t("investmentOptions")}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t("investmentOptionsDesc")}
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  name: t("savingsCertificates"),
                  risk: t("veryLow"),
                  desc: t("savingsCertificatesDesc"),
                },
                {
                  name: t("fractionalRealEstate"),
                  risk: t("medium"),
                  desc: t("fractionalRealEstateDesc"),
                },
                {
                  name: t("stocks"),
                  risk: t("high"),
                  desc: t("stocksDesc"),
                },
                {
                  name: t("mutualFunds"),
                  risk: t("medium"),
                  desc: t("mutualFundsDesc"),
                },
                {
                  name: t("digitalGold"),
                  risk: t("medium"),
                  desc: t("digitalGoldDesc"),
                },
                {
                  name: t("blendedPortfolio"),
                  risk: t("smart"),
                  desc: t("blendedPortfolioDesc"),
                },
              ].map((opt) => (
                <div
                  key={opt.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      opt.risk === t("veryLow") && "bg-green-500",
                      opt.risk === t("low") && "bg-emerald-500",
                      opt.risk === t("medium") && "bg-yellow-500",
                      opt.risk === t("high") && "bg-orange-500",
                      opt.risk === t("smart") && "bg-gradient-accent",
                    )}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{opt.name}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {opt.risk}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary-glow/30 bg-primary-glow/5 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5 text-primary-glow" />
                <p className="text-sm font-semibold text-primary-glow">
                  {t("aiAdvisor")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("aiAdvisorDesc")}
              </p>
            </div>
          </div>

          <Button
            onClick={next}
            size="lg"
            className="w-full bg-gradient-accent shadow-glow cursor-pointer hover:scale-102 transition-transform duration-200"
          >
            {t("nextSmartFeatures")}{" "}
            <ArrowRight
              className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="min-h-[80vh] flex flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Target className="h-6 w-6 text-primary-glow" />
            </div>
            <h2 className="mb-2 font-display text-3xl font-bold">
              {t("smartFeatures")}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t("smartFeaturesDesc")}
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <PiggyBank className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("financialGoals")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("financialGoalsDesc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <LineChart className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("smartBudget")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("smartBudgetDesc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <Zap className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("iftttRules")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("iftttRulesDesc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <Users className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("familyWallet")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("familyWalletDesc")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <Award className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t("gamification")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("gamificationDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={next}
            size="lg"
            className="mt-8 w-full bg-gradient-accent shadow-glow cursor-pointer hover:scale-102 transition-transform duration-200"
          >
            {t("nextTechRoadmap")}{" "}
            <ArrowRight
              className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="min-h-[80vh] flex flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Gem className="h-6 w-6 text-primary-glow" />
            </div>
            <h2 className="mb-2 font-display text-3xl font-bold text-center">
              {t("poweredBy")}
            </h2>
            <p className="mb-6 text-muted-foreground text-center">
              {t("poweredByDesc")}
            </p>
          </div>

          <div>
            <Button
              onClick={completeOnboarding}
              size="lg"
              className="mt-8 w-full bg-gradient-accent shadow-glow cursor-pointer hover:scale-102 transition-transform duration-200"
            >
              {t("enterApp")}
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t("footerText")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
