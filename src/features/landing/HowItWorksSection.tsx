"use client";

import { useTranslations } from "next-intl";

export default function HowItWorksSection() {
  const t = useTranslations("HomePage.howItWorks");

  const steps = [
    {
      number: "01",
      title: t("steps.linkBank.title"),
      description: t("steps.linkBank.description"),
      icon: "🏦",
    },
    {
      number: "02",
      title: t("steps.chooseMode.title"),
      description: t("steps.chooseMode.description"),
      icon: "⚙️",
    },
    {
      number: "03",
      title: t("steps.shopNormal.title"),
      description: t("steps.shopNormal.description"),
      icon: "🛍️",
    },
    {
      number: "04",
      title: t("steps.changeGrows.title"),
      description: t("steps.changeGrows.description"),
      icon: "📈",
    },
  ];

  const examples = [
    {
      paid: "47",
      rounded: "50",
      invested: "3",
      mode: t("examples.modes.normal"),
    },
    {
      paid: "47",
      rounded: "50",
      invested: "3",
      mode: t("examples.modes.medium"),
    },
    {
      paid: "123",
      rounded: "130",
      invested: "7",
      mode: t("examples.modes.normal"),
    },
    {
      paid: "215",
      rounded: "220",
      invested: "5",
      mode: t("examples.modes.normal"),
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
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

        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group relative rounded-3xl border border-white/8 bg-white/3 p-8 hover:border-[#d4af37]/30 hover:bg-white/5 transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">{step.icon}</span>
                <span className="font-display text-5xl font-black text-white/8 group-hover:text-[#d4af37]/20 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-white/40 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/8 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              {t("table.title")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {[
                    t("table.headers.paid"),
                    t("table.headers.roundedTo"),
                    t("table.headers.invested"),
                    t("table.headers.mode"),
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-4 text-start text-xs font-bold uppercase tracking-wider text-white/30"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {examples.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-8 py-4 text-white/70 font-mono">
                      {row.paid} EGP
                    </td>
                    <td className="px-8 py-4 text-white/70 font-mono">
                      {row.rounded} EGP
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] font-bold text-sm font-mono">
                        +{row.invested} EGP
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-white/5 text-white/50 text-xs font-medium">
                        {row.mode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
