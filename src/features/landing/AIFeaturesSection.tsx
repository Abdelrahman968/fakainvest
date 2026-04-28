"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AIFeaturesSection() {
  const t = useTranslations("HomePage.aiFeatures");

  const features = [
    {
      icon: "💡",
      title: t("features.smartNudges.title"),
      description: t("features.smartNudges.description"),
      isQuote: true,
    },
    {
      icon: "📊",
      title: t("features.spendingAnalysis.title"),
      description: t("features.spendingAnalysis.description"),
      isQuote: false,
    },
    {
      icon: "🔮",
      title: t("features.futureSimulator.title"),
      description: t("features.futureSimulator.description"),
      isQuote: true,
    },
    {
      icon: "❤️",
      title: t("features.financialHealthScore.title"),
      description: t("features.financialHealthScore.description"),
      isQuote: false,
    },
    {
      icon: "📝",
      title: t("features.monthlyAIReport.title"),
      description: t("features.monthlyAIReport.description"),
      isQuote: false,
    },
    {
      icon: "🔔",
      title: t("features.marketAlerts.title"),
      description: t("features.marketAlerts.description"),
      isQuote: true,
    },
  ];

  const rules = [
    t("rules.uberRide"),
    t("rules.fridayGold"),
    t("rules.cashback"),
    t("rules.exceedFoodBudget"),
    t("rules.endOfMonthSurplus"),
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="aiFeatures">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#d4af37]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight">
            {t("title.line1")}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040]">
              {t("title.highlight")}
            </span>
          </h2>
          <p className="mt-4 text-white/40 max-w-xl text-lg">
            {t("description")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/8 bg-white/3 p-6 hover:border-[#d4af37]/20 hover:bg-white/5 transition-all duration-400"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                {f.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${f.isQuote ? "text-[#d4af37]/70 italic" : "text-white/40"}`}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[#d4af37]/20 from-[#d4af37]/5 to-transparent p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {t("rulesSection.title")}
              </h3>
              <p className="text-xs text-white/40">
                {t("rulesSection.subtitle")}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="mt-1 w-5 h-5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 flex items-center justify-center shrink-0 group-hover:bg-[#d4af37]/15 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-mono">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
