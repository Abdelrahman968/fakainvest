import { LucideIcon } from "lucide-react";

export interface MoreItem {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
  color: string;
  badge?: string;
}
