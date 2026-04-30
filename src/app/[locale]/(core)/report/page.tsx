"use client";

import {
  Share2,
  Download,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReport } from "@/hooks/useReport";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const Report = () => {
  const t = useTranslations("Report");
  const { report, loading, error } = useReport();

  const handleShare = async () => {
    if (!report) return;
    try {
      await navigator.share({
        title: report.month,
        text: report.insight,
      });
    } catch {
      navigator.clipboard.writeText(report.insight);
      toast.success(t("copiedToClipboard"));
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const content = `
${report.month} - ${t("financialReport")}

${t("totalSpent")}: ${report.totalSpent.toLocaleString()} EGP (${report.spentChange > 0 ? "+" : ""}${report.spentChange}% ${t("vsLastMonth")})
${t("totalInvested")}: ${report.totalInvested.toLocaleString()} EGP (${t("return")}: ${report.investmentReturn.toFixed(1)}%)

${t("topCategory")}: ${report.topCategory} (${report.topCategoryAmount.toLocaleString()} EGP)
${t("roundUps")}: ${report.roundUpsThisMonth.toFixed(2)} EGP

${t("insight")}: ${report.insight}
${t("tip")}: ${report.tip}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.month.replace(/\s/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("error")}</p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    );
  }

  const isDecrease = report.spentChange < 0;

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <h1 className="font-display text-3xl font-bold">{report.month}</h1>
      </header>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 shadow-elegant">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
          <Sparkles className="h-3 w-3" /> {t("poweredBy")} FakaAI
        </div>
        <p className="relative mt-2 text-base text-primary-foreground/90">
          {t("greeting")}
        </p>

        <div className="relative mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">
              {t("totalSpent")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-primary-foreground">
              EGP {report.totalSpent.toLocaleString()}
            </p>
            <span
              className={`stat-pill mt-1 ${isDecrease ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}
            >
              {isDecrease ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              {Math.abs(report.spentChange)}%
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">
              {t("totalInvested")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-primary-foreground">
              EGP {report.totalInvested.toLocaleString()}
            </p>
            <span className="stat-pill mt-1 bg-accent/20 text-accent">
              <TrendingUp className="h-3 w-3" />+
              {report.investmentReturn.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">{t("topCategory")}</p>
          <p className="mt-1 font-display text-lg font-bold">
            {report.topCategory}
          </p>
          <p className="text-xs text-muted-foreground">
            EGP {report.topCategoryAmount.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">{t("roundUps")}</p>
          <p className="mt-1 font-display text-lg font-bold gold-text">
            EGP {report.roundUpsThisMonth.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {report.transactionCount} {t("transactions")}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary-glow/30 bg-primary-glow/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-glow" />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-primary-glow">
            {t("geminiRecap")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{report.insight}</p>
      </div>

      <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-warning">
            {t("tipForNextMonth")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{report.tip}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" /> {t("pdf")}
        </Button>
        <Button
          className="flex-1 gap-2 bg-gradient-accent shadow-glow"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" /> {t("share")}
        </Button>
      </div>
    </div>
  );
};

export default Report;
