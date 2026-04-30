"use client";

import {
  Target,
  PiggyBank,
  Zap,
  FileText,
  Store,
  User,
  Building2,
  Users,
  Trophy,
  TrendingUp,
  Gift,
  Receipt,
  Wallet as WalletIcon,
} from "lucide-react";
import MoreItem from "./MoreItem";
import { MoreItem as MoreItemType } from "@/types/more";

const items: MoreItemType[] = [
  {
    to: "/wallet",
    icon: WalletIcon,
    labelKey: "walletCard",
    descKey: "walletDesc",
    color: "199 89% 60%",
  },
  {
    to: "/transactions",
    icon: Receipt,
    labelKey: "transactions",
    descKey: "transactionsDesc",
    color: "162 72% 45%",
    badge: "new",
  },
  {
    to: "/insights",
    icon: TrendingUp,
    labelKey: "insights",
    descKey: "insightsDesc",
    color: "199 89% 60%",
    badge: "new",
  },
  {
    to: "/goals",
    icon: Target,
    labelKey: "goals",
    descKey: "goalsDesc",
    color: "199 89% 60%",
  },
  {
    to: "/budget",
    icon: PiggyBank,
    labelKey: "budget",
    descKey: "budgetDesc",
    color: "162 72% 45%",
  },
  {
    to: "/rules",
    icon: Zap,
    labelKey: "rules",
    descKey: "rulesDesc",
    color: "45 90% 60%",
  },
  {
    to: "/report",
    icon: FileText,
    labelKey: "monthlyReport",
    descKey: "reportDesc",
    color: "210 55% 47%",
  },
  {
    to: "/market",
    icon: Store,
    labelKey: "market",
    descKey: "marketDesc",
    color: "270 60% 60%",
  },
  {
    to: "/real-estate",
    icon: Building2,
    labelKey: "realEstate",
    descKey: "realEstateDesc",
    color: "162 72% 45%",
  },
  {
    to: "/family",
    icon: Users,
    labelKey: "familyWallet",
    descKey: "familyDesc",
    color: "270 60% 60%",
  },
  {
    to: "/rewards",
    icon: Trophy,
    labelKey: "rewards",
    descKey: "rewardsDesc",
    color: "45 90% 60%",
  },
  {
    to: "/referral",
    icon: Gift,
    labelKey: "referral",
    descKey: "referralDesc",
    color: "162 72% 45%",
    badge: "new",
  },
  {
    to: "/profile",
    icon: User,
    labelKey: "profile",
    descKey: "profileDesc",
    color: "199 89% 60%",
  },
];

export default function MoreList() {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.to}>
          <MoreItem item={item} />
        </li>
      ))}
    </ul>
  );
}
