"use client";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity as ActivityIcon,
  Sparkles,
  PieChart,
  User,
  Target,
  PiggyBank,
  Zap,
  FileText,
  Store,
  Building2,
  Users,
  Trophy,
  TrendingUp,
  Wallet as WalletIcon,
  Gift,
  Sigma,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const t = useTranslations("AppSidebar");

  const main = [
    { to: "/dashboard", label: t("nav.home"), icon: Home },
    { to: "/activity", label: t("nav.activity"), icon: ActivityIcon },
    { to: "/portfolio", label: t("nav.portfolio"), icon: PieChart },
    { to: "/wallet", label: t("nav.wallet"), icon: WalletIcon },
    { to: "/transactions", label: t("nav.transactions"), icon: FileText },
    { to: "/chat", label: t("nav.geminiAI"), icon: Sparkles },
  ];

  const planning = [
    { to: "/goals", label: t("nav.goals"), icon: Target },
    { to: "/budget", label: t("nav.budget"), icon: PiggyBank },
    { to: "/rules", label: t("nav.rules"), icon: Zap },
    { to: "/insights", label: t("nav.insights"), icon: TrendingUp },
    { to: "/report", label: t("nav.monthlyReport"), icon: FileText },
  ];

  const grow = [
    { to: "/market", label: t("nav.marketOffers"), icon: Store },
    { to: "/real-estate", label: t("nav.realEstate"), icon: Building2 },
    { to: "/family", label: t("nav.familyWallet"), icon: Users },
    { to: "/rewards", label: t("nav.rewards"), icon: Trophy },
    { to: "/referral", label: t("nav.referEarn"), icon: Gift },
  ];

  const account = [{ to: "/profile", label: t("nav.profile"), icon: User }];

  const locale = useLocale();

  const cleanPathname = pathname.replace(`/${locale}`, "") || "/";

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground/70">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((it) => (
            <SidebarMenuItem key={it.to}>
              <SidebarMenuButton asChild>
                <Link
                  href={it.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                    cleanPathname === it.to
                      ? "bg-gradient-accent text-primary-foreground font-semibold shadow-glow"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <it.icon className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                  {!collapsed && <span>{it.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
            <Sigma
              className="h-5 w-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          {!collapsed && (
            <div>
              <p className="font-display text-base font-bold leading-none">
                {t("brand.name")}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("brand.tagline")}
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {renderGroup(t("groups.banking"), main)}
        {/* {renderGroup(t("groups.planAndGrow"), planning)} */}
        {/* {renderGroup(t("groups.discover"), grow)} */}
        {renderGroup(t("groups.account"), account)}
      </SidebarContent>
    </Sidebar>
  );
}
