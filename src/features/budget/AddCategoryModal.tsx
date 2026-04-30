"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import CategoryIcon from "./CategoryIcon";

const iconCategories = [
  { emoji: "🍽️", label: "Food" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "🚗", label: "Transport" },
  { emoji: "🛍️", label: "Shopping" },
  { emoji: "🎬", label: "Entertainment" },
  { emoji: "🧾", label: "Bills" },
  { emoji: "🏠", label: "Home" },
  { emoji: "📱", label: "Electronics" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🎓", label: "Education" },
  { emoji: "💪", label: "Fitness" },
  { emoji: "🎁", label: "Gifts" },
  { emoji: "🛒", label: "Groceries" },
  { emoji: "📺", label: "TV" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "📚", label: "Books" },
  { emoji: "❤️", label: "Health" },
  { emoji: "💼", label: "Work" },
  { emoji: "🐕", label: "Pets" },
  { emoji: "💧", label: "Water" },
  { emoji: "🌿", label: "Eco" },
  { emoji: "☀️", label: "Outdoor" },
  { emoji: "⚡", label: "Energy" },
];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, emoji: string, cap: number) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddCategoryModalProps) {
  const t = useTranslations("Budget");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [cap, setCap] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const capNumber = Number(cap);
    if (!name.trim()) {
      return;
    }
    if (!Number.isFinite(capNumber) || capNumber <= 0) {
      return;
    }
    await onSubmit(name.trim(), emoji, capNumber);
    if (!isSubmitting) {
      setName("");
      setEmoji("🍽️");
      setCap("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-elegant sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{t("newCategory")}</h3>
          <button
            onClick={() => !isSubmitting && onClose()}
            className="rounded-full bg-secondary p-2 transition-colors hover:bg-secondary/80"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
            {iconCategories.map((icon) => (
              <button
                key={icon.emoji}
                onClick={() => setEmoji(icon.emoji)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-2 transition-all",
                  emoji === icon.emoji
                    ? "bg-primary-glow/20 ring-2 ring-primary-glow"
                    : "bg-secondary hover:bg-secondary/80",
                )}
                disabled={isSubmitting}
              >
                <CategoryIcon emoji={icon.emoji} />
                <span className="text-[8px] text-muted-foreground">
                  {icon.label}
                </span>
              </button>
            ))}
          </div>

          <Input
            placeholder={t("categoryNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-2xl"
            disabled={isSubmitting}
          />

          <Input
            type="number"
            placeholder={t("monthlyCapPlaceholder")}
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            className="h-11 rounded-2xl"
            disabled={isSubmitting}
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-accent shadow-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("addCategory")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
