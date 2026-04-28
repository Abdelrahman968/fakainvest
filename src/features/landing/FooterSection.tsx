"use client";

import { Coins, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FooterSection() {
  const t = useTranslations("HomePage.footer");

  const stats = [
    { v: t("stats.targetMarket.value"), l: t("stats.targetMarket.label") },
    { v: t("stats.competitors.value"), l: t("stats.competitors.label") },
    { v: t("stats.timeline.value"), l: t("stats.timeline.label") },
  ];

  return (
    <>
      <section className="py-10 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#d4af37]/10 via-[#d4af37]/3 to-transparent blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.3)]">
              <Coins className="w-10 h-10 text-[#0a0a0f]" />
            </div>
          </div>

          <h2 className="font-display text-5xl sm:text-7xl font-black text-white leading-[0.95] mb-6">
            {t("title.line1")}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040]">
              {t("title.highlight")}
            </span>
          </h2>

          <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-[#d4af37] to-[#b8860b] text-[#0a0a0f] font-bold shadow-[0_0_40px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-4 h-4" />
              {t("cta")}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display text-lg font-black text-[#d4af37]">
                  {s.v}
                </p>
                <p className="text-[11px] text-white/30 mt-1 uppercase tracking-wide">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
              <Coins className="w-4 h-4 text-[#0a0a0f]" />
            </div>
            <span className="font-display font-black text-white">
              FakaInvest
            </span>
          </div>

          <p className="text-white/25 text-xs text-center">
            {t("footer.tagline")}
            <br />
            {t("footer.info")}
          </p>

          <p className="text-white/20 text-xs">
            {t("footer.copyright", { year: new Date().getFullYear() })}
            <span className="font-display text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040] mx-1">
              {t("footer.team")}
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}
