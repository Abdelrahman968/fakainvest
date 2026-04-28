"use client";

import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("HomePage.features");

  const featurePanels = [
    {
      tag: t("panels.budgetManagement.tag"),
      icon: "📉",
      title: t("panels.budgetManagement.title"),
      description: t("panels.budgetManagement.description"),
      items: [
        t("panels.budgetManagement.items.0"),
        t("panels.budgetManagement.items.1"),
        t("panels.budgetManagement.items.2"),
        t("panels.budgetManagement.items.3"),
      ],
    },
    {
      tag: t("panels.financialGoals.tag"),
      icon: "🎯",
      title: t("panels.financialGoals.title"),
      description: t("panels.financialGoals.description"),
      items: [
        t("panels.financialGoals.items.0"),
        t("panels.financialGoals.items.1"),
        t("panels.financialGoals.items.2"),
        t("panels.financialGoals.items.3"),
      ],
    },
    {
      tag: t("panels.gamification.tag"),
      icon: "🏆",
      title: t("panels.gamification.title"),
      description: t("panels.gamification.description"),
      items: [
        t("panels.gamification.items.0"),
        t("panels.gamification.items.1"),
        t("panels.gamification.items.2"),
        t("panels.gamification.items.3"),
      ],
    },
    {
      tag: t("panels.familyWallet.tag"),
      icon: "👨‍👩‍👧",
      title: t("panels.familyWallet.title"),
      description: t("panels.familyWallet.description"),
      items: [
        t("panels.familyWallet.items.0"),
        t("panels.familyWallet.items.1"),
        t("panels.familyWallet.items.2"),
        t("panels.familyWallet.items.3"),
      ],
    },
  ];

  const cashbackPartners = [
    t("cashbackPartners.stores"),
    t("cashbackPartners.restaurants"),
    t("cashbackPartners.ecommerce"),
    t("cashbackPartners.cafes"),
  ];

  return (
    <section className="py-32 px-6" id="features">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">
            {t("badge")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-white">
            {t("title.line1")}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040]">
              {t("title.highlight")}
            </span>
          </h2>
        </div>

        <div className="space-y-4 mb-16">
          {featurePanels.map((panel, i) => (
            <div
              key={panel.tag}
              className={`rounded-3xl border border-white/8 overflow-hidden grid sm:grid-cols-2 hover:border-[#d4af37]/20 transition-all duration-500`}
            >
              <div className={`p-8 ${i % 2 === 1 ? "sm:order-2" : ""}`}>
                <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[11px] font-bold uppercase tracking-wider mb-4">
                  {panel.tag}
                </span>
                <div className="text-3xl mb-3">{panel.icon}</div>
                <h3 className="font-display text-2xl font-black text-white mb-3">
                  {panel.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {panel.description}
                </p>
              </div>
              <div
                className={`bg-white/3 p-8 flex flex-col justify-center ${i % 2 === 1 ? "sm:order-1" : ""}`}
              >
                <ul className="space-y-3">
                  {panel.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-white/60 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/8 bg-linear-to-br from-white/4 to-transparent p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💸</span>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {t("cashbackSection.title")}
              </h3>
              <p className="text-xs text-white/40">
                {t("cashbackSection.subtitle")}
              </p>
            </div>
          </div>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            {t("cashbackSection.description")}
          </p>
          <div className="flex flex-wrap gap-2">
            {cashbackPartners.map((p) => (
              <span
                key={p}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-white/50 text-sm"
              >
                {p}
              </span>
            ))}
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-[#d4af37]/50 text-sm">
              {t("cashbackSection.morePartners")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
