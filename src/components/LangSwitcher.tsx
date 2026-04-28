"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

import { Globe } from "lucide-react";

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" });
  };

  return (
    <button
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 ease-in-out group cursor-pointer hover:scale-102"
      onClick={toggle}
    >
      <Globe className="w-3.5 h-3.5 text-white/50 group-hover:text-[#d4af37] transition-colors" />
      <span className="text-xs font-bold text-white/70 group-hover:text-[#d4af37] uppercase">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
}
