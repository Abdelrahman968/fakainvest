"use client";

import {
  Coffee,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  UtensilsCrossed,
  LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Tv,
  Food: UtensilsCrossed,
};

interface RecentActivityItemProps {
  id: string;
  merchant: string;
  category: string;
  roundUp?: number; // جعلها اختيارية
}

export default function RecentActivityItem({
  merchant,
  category,
  roundUp = 0, // قيمة افتراضية 0
}: RecentActivityItemProps) {
  const IconComponent = categoryIcons[category] || Coffee;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
        <IconComponent className="h-5 w-5 text-primary-glow" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{merchant}</p>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
      <div className="text-right">
        <p className="font-display font-semibold text-accent">
          +{roundUp.toFixed(2)}
        </p>
        <p className="text-[10px] text-muted-foreground">EGP</p>
      </div>
    </li>
  );
}
