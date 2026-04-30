"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationsBell } from "@/components/NotificationsBell";
import {
  CommandPalette,
  SearchTrigger,
  SearchTriggerMobile,
} from "@/components/CommandPalette";
import { useProfile } from "@/hooks/useProfile";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import LangSwitcher from "@/components/LangSwitcher";

const titles: Record<string, string> = {
  "/dashboard": "dashboard",
  "/activity": "activity",
  "/portfolio": "portfolio",
  "/wallet": "wallet",
  "/contacts": "contacts",
  "/transactions": "transactions",
  "/chat": "chat",
  "/goals": "goals",
  "/budget": "budget",
  "/rules": "rules",
  "/insights": "insights",
  "/report": "monthly_report",
  "/market": "market",
  "/real-estate": "realEstate",
  "/family": "family",
  "/rewards": "rewards",
  "/referral": "referral",
  "/profile": "profile",
  "/more": "more",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPay = pathname.includes("pay");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { profile } = useProfile();
  const userInitial = (profile?.display_name || profile?.email || "U")
    .charAt(0)
    .toUpperCase();
  const userAvatar = profile?.avatar_icon ?? "";
  const locale = useLocale();
  const cleanPathname = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const t = useTranslations("CoreLayout");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pageTitle = isPay
    ? locale === "ar"
      ? "ادفع"
      : "Pay"
    : (t(titles[cleanPathname]) ?? "FakaInvest");

  return (
    <SidebarProvider defaultOpen dir={locale === "ar" ? "rtl" : "ltr"}>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <AppSidebar />

      <SidebarInset className="flex min-h-svh flex-col bg-transparent">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl md:h-16 md:px-6">
          <SidebarTrigger className="shrink-0" />
          <h1 className="font-display text-base font-semibold leading-none md:text-lg">
            {pageTitle}
          </h1>

          <div className="ms-auto flex items-center gap-1.5 md:gap-2">
            <SearchTrigger onClick={() => setPaletteOpen(true)} />
            <SearchTriggerMobile onClick={() => setPaletteOpen(true)} />
            <LangSwitcher />
            <NotificationsBell />
            <Link
              href="/profile"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-accent font-display text-xs font-bold text-primary-foreground shadow-glow md:h-9 md:w-9 md:text-sm"
              aria-label="Profile"
            >
              {userInitial || userAvatar || "U"}
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 pt-5 pb-24 sm:px-6 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
