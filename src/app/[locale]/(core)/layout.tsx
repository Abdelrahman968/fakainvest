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
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { profile } = useProfile();
  const userInitial = (profile?.display_name || profile?.email || "U")
    .charAt(0)
    .toUpperCase();
  const userAvatar = profile?.avatar_emoji ?? "";

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

  const locale = useLocale();

  const cleanPathname = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  const t = useTranslations("CoreLayout");

  return (
    <SidebarProvider defaultOpen dir={locale === "ar" ? "rtl" : "ltr"}>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <AppSidebar />

      <SidebarInset className="flex flex-col bg-transparent">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/40 bg-background/80 px-4 py-3.5 backdrop-blur-xl md:px-8 ">
          <SidebarTrigger className="hidden md:inline-flex" />
          <h1 className="font-display text-base font-semibold md:text-lg block md:hidden">
            {t(titles[cleanPathname]) ?? "FakaInvest"}
          </h1>
          <div className="ms-auto flex items-center gap-2">
            <SearchTrigger onClick={() => setPaletteOpen(true)} />
            <SearchTriggerMobile onClick={() => setPaletteOpen(true)} />
            <LangSwitcher />
            <NotificationsBell />
            <Link
              href="/profile"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-bold text-primary-foreground shadow-glow md:flex"
              aria-label="Profile"
            >
              {userInitial || userAvatar || "U"}
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-5 sm:max-w-lg sm:px-6 md:max-w-6xl md:px-8 md:pb-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
