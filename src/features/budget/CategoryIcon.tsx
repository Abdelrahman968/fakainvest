"use client";

import {
  Utensils,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  FileText,
  Home,
  Smartphone,
  Plane,
  GraduationCap,
  Dumbbell,
  Gift,
  ShoppingCart,
  Tv,
  Music,
  Gamepad,
  Book,
  Heart,
  Briefcase,
  Dog,
  Cat,
  Droplet,
  Leaf,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconComponents: Record<string, React.ElementType> = {
  "🍽️": Utensils,
  "☕": Coffee,
  "🚗": Car,
  "🛍️": ShoppingBag,
  "🎬": Film,
  "🧾": FileText,
  "🏠": Home,
  "📱": Smartphone,
  "✈️": Plane,
  "🎓": GraduationCap,
  "💪": Dumbbell,
  "🎁": Gift,
  "🛒": ShoppingCart,
  "📺": Tv,
  "🎵": Music,
  "🎮": Gamepad,
  "📚": Book,
  "❤️": Heart,
  "💼": Briefcase,
  "🐕": Dog,
  "🐱": Cat,
  "💧": Droplet,
  "🌿": Leaf,
  "☀️": Sun,
  "🌙": Moon,
  "⚡": Zap,
};

interface CategoryIconProps {
  emoji: string;
  className?: string;
}

export default function CategoryIcon({ emoji, className }: CategoryIconProps) {
  const IconComponent = iconComponents[emoji];

  if (IconComponent) {
    return (
      <IconComponent className={cn("h-5 w-5 text-primary-glow", className)} />
    );
  }

  return <span className={cn("text-xl", className)}>{emoji}</span>;
}
