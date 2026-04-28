"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Coins, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations("HomePage.hero");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      alpha: number;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const stats = [
    { value: t("stats.startFrom.value"), label: t("stats.startFrom.label") },
    { value: t("stats.bestYield.value"), label: t("stats.bestYield.label") },
    { value: t("stats.aiAdvisor.value"), label: t("stats.aiAdvisor.label") },
    {
      value: t("stats.instruments.value"),
      label: t("stats.instruments.label"),
    },
  ];

  return (
    <section className="pt-10 pb-10 relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#c0392b]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-xs font-medium text-[#d4af37] tracking-wider uppercase">
            {t("badge")}
          </span>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.4)]">
              <Coins className="w-12 h-12 text-[#0a0a0f]" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#d4af37] animate-ping opacity-60" />
          </div>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
          {t("title.line1")}{" "}
          <span className="relative inline-block ">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] via-[#f0c040] to-[#b8860b]">
              {t("title.highlight")}
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M0 8 Q75 0 150 8 Q225 16 300 8"
                stroke="#d4af37"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </span>{" "}
          ,<br />
          <div className="rtl:mt-13">{t("title.line2")}</div>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t("description")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-4"
            >
              <p className="font-display text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040]">
                {s.value}
              </p>
              <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wide">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-[#d4af37] to-[#b8860b] text-[#0a0a0f] font-bold text-base shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <TrendingUp className="w-4 h-4" />
            {t("cta")}
          </a>
          <span className="text-xs text-white/30">{t("ctaNote")}</span>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </div>
    </section>
  );
}
