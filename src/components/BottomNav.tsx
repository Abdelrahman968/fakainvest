import { Link, usePathname } from "@/i18n/navigation";

import { Home, Activity, Wallet, PieChart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const items = [
  { to: "/dashboard", label: "home", icon: Home },
  { to: "/activity", label: "activity", icon: Activity },
  { to: "/wallet", label: "wallet", icon: Wallet },
  { to: "/portfolio", label: "portfolio", icon: PieChart },
  { to: "/more", label: "more", icon: MoreHorizontal },
];

export default function BottomNav() {
  const t = useTranslations("BottomNav");

  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/onboarding")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 sm:px-6 md:hidden">
      <div className="mx-auto max-w-md rounded-3xl border border-border/60 bg-card/80 backdrop-blur-2xl shadow-card">
        <ul className="flex items-center justify-between px-2 py-1.5">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                href={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all",
                  pathname === to
                    ? "text-primary-foreground bg-gradient-accent shadow-glow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                <span>{t(label) || label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
