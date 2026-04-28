"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Brain,
  Building,
  ClipboardMinus,
  CreditCard,
  Goal,
  HandCoins,
  HandHelping,
  House,
  List,
  Receipt,
  Scale,
  Search,
  Sparkles,
  Store,
  Trophy,
  User,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useGoals } from "@/hooks/useGoals";
import { useTransactions } from "@/hooks/useTransactions";
import { useHoldings } from "@/hooks/useHoldings";

const pages = [
  {
    label: "Home",
    to: "/dashboard",
    emoji: <House className="h-5 w-5" />,
    tKey: "home",
  },
  {
    label: "Activity",
    to: "/activity",
    emoji: <List className="h-5 w-5" />,
    tKey: "activity",
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    emoji: <BarChart3 className="h-5 w-5" />,
    tKey: "portfolio",
  },
  {
    label: "Wallet & card",
    to: "/wallet",
    emoji: <CreditCard className="h-5 w-5" />,
    tKey: "wallet",
  },
  {
    label: "Transactions",
    to: "/transactions",
    emoji: <Receipt className="h-5 w-5" />,
    tKey: "transactions",
  },
  {
    label: "AI Chat",
    to: "/chat",
    emoji: <Sparkles className="h-5 w-5" />,
    tKey: "chat",
  },
  {
    label: "Goals",
    to: "/goals",
    emoji: <Goal className="h-5 w-5" />,
    tKey: "goals",
  },
  {
    label: "Budget",
    to: "/budget",
    emoji: <HandCoins className="h-5 w-5" />,
    tKey: "budget",
  },
  {
    label: "Rules",
    to: "/rules",
    emoji: <Scale className="h-5 w-5" />,
    tKey: "rules",
  },
  {
    label: "Insights",
    to: "/insights",
    emoji: <Brain className="h-5 w-5" />,
    tKey: "insights",
  },
  {
    label: "Monthly report",
    to: "/report",
    emoji: <ClipboardMinus className="h-5 w-5" />,
    tKey: "report",
  },
  {
    label: "Market & Offers",
    to: "/market",
    emoji: <Store className="h-5 w-5" />,
    tKey: "market",
  },
  {
    label: "Real Estate",
    to: "/real-estate",
    emoji: <Building className="h-5 w-5" />,
    tKey: "realEstate",
  },
  {
    label: "Family Wallet",
    to: "/family",
    emoji: <UsersRound className="h-5 w-5" />,
    tKey: "familyWallet",
  },
  {
    label: "Rewards",
    to: "/rewards",
    emoji: <Trophy className="h-5 w-5" />,
    tKey: "rewards",
  },
  {
    label: "Refer & earn",
    to: "/referral",
    emoji: <HandHelping className="h-5 w-5" />,
    tKey: "referral",
  },
  {
    label: "Profile",
    to: "/profile",
    emoji: <User className="h-5 w-5" />,
    tKey: "profile",
  },
];

export const CommandPalette = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const router = useRouter();
  const t = useTranslations("CommandPalette");
  const { goals, loading: goalsLoading } = useGoals();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { holdings, loading: holdingsLoading } = useHoldings();

  const go = (to: string) => {
    onOpenChange(false);
    router.push(to);
  };

  const getTransactionIcon = (type?: string, method?: string) => {
    if (type === "sent") return "💸";
    if (type === "received") return "💰";
    if (method === "Card") return "💳";
    return "💵";
  };

  const getHoldingEmoji = (type: string) => {
    switch (type) {
      case "Savings Cert":
        return "🏦";
      case "Stocks":
        return "📈";
      case "Gold":
        return "🥇";
      case "Money Market":
        return "💰";
      case "Sukuk":
        return "🕌";
      default:
        return "💎";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">{t("dialogTitle")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("dialogDescription")}
        </DialogDescription>
        <Command className="**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 **:[[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_ [cmdk-item]_svg]:w-5">
          <CommandInput placeholder={t("searchPlaceholder")} />
          <CommandList className="max-h-[440px]">
            <CommandEmpty>{t("noResults")}</CommandEmpty>

            {/* Pages Section */}
            <CommandGroup heading={t("pages")}>
              {pages.map((p) => (
                <CommandItem
                  key={p.to}
                  onSelect={() => go(p.to)}
                  value={`page ${p.label}`}
                >
                  <span className="me-2 text-base">{p.emoji}</span>
                  {t(p.tKey) || p.label}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Recent Transactions Section */}
            {!transactionsLoading && transactions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={t("recentTransactions")}>
                  {transactions.slice(0, 5).map((transaction: any) => (
                    <CommandItem
                      key={transaction.id}
                      onSelect={() => go("/activity")}
                      value={`tx ${transaction.merchant || transaction.counterparty || transaction.description} ${transaction.category}`}
                    >
                      <span className="mr-2 text-base">
                        {getTransactionIcon(
                          transaction.type,
                          transaction.method,
                        )}
                      </span>
                      <span className="flex-1">
                        {transaction.merchant ||
                          transaction.counterparty ||
                          transaction.description ||
                          "Transaction"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        EGP {(transaction.amount || 0).toFixed(2)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Holdings Section */}
            {!holdingsLoading && holdings.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={t("holdings")}>
                  {holdings.slice(0, 5).map((holding) => (
                    <CommandItem
                      key={holding.id}
                      onSelect={() => go("/portfolio")}
                      value={`hold ${holding.name} ${holding.type}`}
                    >
                      <span className="me-2 text-base">
                        {getHoldingEmoji(holding.type)}
                      </span>
                      <span className="flex-1">{holding.name}</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        +{holding.return1m}%
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Goals Section */}
            {!goalsLoading && goals.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={t("goals")}>
                  {goals.slice(0, 5).map((goal) => (
                    <CommandItem
                      key={goal.id}
                      onSelect={() => go("/goals")}
                      value={`goal ${goal.title}`}
                    >
                      <span className="me-2 text-base">{goal.emoji}</span>
                      <span className="flex-1">{goal.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {goal.progress.toFixed(0)}%
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export const SearchTrigger = ({ onClick }: { onClick: () => void }) => {
  const isMac = useMemo(() => /Mac|iPhone|iPad/.test(navigator.platform), []);
  const t = useTranslations("SearchTrigger");

  return (
    <button
      onClick={onClick}
      className="hidden h-10 items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 text-xs text-muted-foreground transition-colors hover:bg-secondary md:flex md:w-[280px] lg:w-[360px]"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="flex-1 text-start">{t("searchAnything")}</span>
      <kbd className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
};

export const SearchTriggerMobile = ({ onClick }: { onClick: () => void }) => {
  const t = useTranslations("SearchTrigger");

  return (
    <button
      onClick={onClick}
      aria-label={t("search")}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 transition-colors hover:bg-secondary md:hidden"
    >
      <Search className="h-4 w-4" />
    </button>
  );
};
