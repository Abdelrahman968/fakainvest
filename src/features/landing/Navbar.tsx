"use client";

import { useState, useEffect } from "react";
import { Menu, X, Coins, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

import { useProfile } from "@/hooks/useProfile";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { profile } = useProfile();

  const t = useTranslations("HomePage.navbar");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("links.howItWorks"), href: "#how-it-works" },
    { name: t("links.investmentOptions"), href: "#investmentOptions" },
    { name: t("links.aiFeatures"), href: "#aiFeatures" },
    { name: t("links.features"), href: "#features" },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(`/${newLocale}`);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/8"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <Coins className="w-5 h-5 text-[#0a0a0f]" />
              </div>
              <span className="font-display font-black text-white text-lg tracking-tight">
                {t("logo.faka")}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4af37] to-[#f0c040] rtl:mr-1">
                  {t("logo.invest")}
                </span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/50 hover:text-[#d4af37] text-sm font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#d4af37] to-[#f0c040] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 ease-in-out group cursor-pointer hover:scale-102"
              >
                <Globe className="w-3.5 h-3.5 text-white/50 group-hover:text-[#d4af37] transition-colors" />
                <span className="text-xs font-bold text-white/70 group-hover:text-[#d4af37] uppercase">
                  {locale === "en" ? "AR" : "EN"}
                </span>
              </button>

              <Link
                href={profile ? "/dashboard" : "/auth"}
                className="hidden md:inline-flex px-5 py-2.5 rounded-xl bg-linear-to-r from-[#d4af37] to-[#b8860b] text-[#0a0a0f] text-sm font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {profile ? t("cta") : t("login")}
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-20 left-6 right-6 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/70 hover:text-[#d4af37] py-2 text-base font-medium transition-colors border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <Link
              href={profile ? "/dashboard" : "/auth"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-5 py-3 rounded-xl bg-linear-to-r from-[#d4af37] to-[#b8860b] text-[#0a0a0f] text-center font-bold transition-all duration-300"
            >
              {profile ? t("cta") : t("login")}
            </Link>
          </div>
        </div>
      </div>
      <div className="h-15 bg-transparent" />
    </>
  );
}
