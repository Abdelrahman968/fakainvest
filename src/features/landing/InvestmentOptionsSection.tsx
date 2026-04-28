"use client";

import { useTranslations } from "next-intl";

export default function InvestmentOptionsSection() {
  const t = useTranslations("HomePage.investmentOptions");

  const instruments = [
    {
      id: 1,
      name: t("instruments.savingsCertificates.name"),
      risk: t("instruments.savingsCertificates.risk"),
      riskColor: "#22c55e",
      description: t("instruments.savingsCertificates.description"),
      icon: "🏛️",
      badge: t("instruments.savingsCertificates.badge"),
    },
    {
      id: 2,
      name: t("instruments.fractionalRealEstate.name"),
      risk: t("instruments.fractionalRealEstate.risk"),
      riskColor: "#f59e0b",
      description: t("instruments.fractionalRealEstate.description"),
      icon: "🏠",
      badge: t("instruments.fractionalRealEstate.badge"),
    },
    {
      id: 3,
      name: t("instruments.stocks.name"),
      risk: t("instruments.stocks.risk"),
      riskColor: "#ef4444",
      description: t("instruments.stocks.description"),
      icon: "📊",
      badge: t("instruments.stocks.badge"),
    },
    {
      id: 4,
      name: t("instruments.mutualFunds.name"),
      risk: t("instruments.mutualFunds.risk"),
      riskColor: "#f59e0b",
      description: t("instruments.mutualFunds.description"),
      icon: "🗂️",
      badge: null,
    },
    {
      id: 5,
      name: t("instruments.digitalGold.name"),
      risk: t("instruments.digitalGold.risk"),
      riskColor: "#f59e0b",
      description: t("instruments.digitalGold.description"),
      icon: "🥇",
      badge: t("instruments.digitalGold.badge"),
    },
    {
      id: 6,
      name: t("instruments.blendedPortfolio.name"),
      risk: t("instruments.blendedPortfolio.risk"),
      riskColor: "#d4af37",
      description: t("instruments.blendedPortfolio.description"),
      icon: "✨",
      badge: t("instruments.blendedPortfolio.badge"),
    },
  ];

  const riskMap: Record<string, string> = {
    [t("instruments.savingsCertificates.risk")]:
      "bg-green-500/10 text-green-400",
    [t("instruments.fractionalRealEstate.risk")]:
      "bg-amber-500/10 text-amber-400",
    [t("instruments.stocks.risk")]: "bg-red-500/10 text-red-400",
    [t("instruments.blendedPortfolio.risk")]: "bg-[#d4af37]/10 text-[#d4af37]",
  };

  return (
    <section className="py-32 px-6" id="investmentOptions">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">
            {t("badge")}
          </span>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((inst) => (
            <div
              key={inst.id}
              className="group relative rounded-3xl border border-white/8 bg-linear-to-b from-white/4 to-transparent p-6 hover:border-[#d4af37]/25 transition-all duration-500 hover:-translate-y-1"
            >
              {inst.badge && (
                <div className="absolute -top-3 right-6">
                  <span className="px-3 py-1 rounded-full bg-[#d4af37] text-[#0a0a0f] text-[10px] font-bold uppercase tracking-wider">
                    {inst.badge}
                  </span>
                </div>
              )}

              <div className="text-3xl mb-5">{inst.icon}</div>

              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-display text-lg font-bold text-white">
                  {inst.name}
                </h3>
              </div>

              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold mb-3 ${riskMap[inst.risk]}`}
              >
                {inst.risk} {t("riskSuffix")}
              </span>

              <p className="text-white/40 text-sm leading-relaxed">
                {inst.description}
              </p>

              <div className="absolute top-6 inset-e-6 font-display text-6xl font-black text-white/4 group-hover:text-white/8 transition-colors select-none">
                {inst.id}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/25">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
