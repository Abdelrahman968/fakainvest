"use client";

import { useState } from "react";
import {
  Plus,
  Sparkles,
  Calendar,
  Target,
  X,
  ChevronRight,
  Loader2,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoals, dailyRequired, type Goal } from "@/hooks/useGoals";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const daysUntil = (iso: string) =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

const ProgressRing = ({
  pct,
  color,
  size = 120,
}: {
  pct: number;
  color: string;
  size?: number;
}) => {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, pct) / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="hsl(var(--muted))"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`hsl(${color})`}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.6s var(--transition-smooth)",
        }}
      />
    </svg>
  );
};

const CATEGORIES: { emoji: string; label: Goal["category"]; color: string }[] =
  [
    { emoji: "✈️", label: "Travel", color: "199 89% 60%" },
    { emoji: "🏠", label: "Apartment", color: "45 90% 60%" },
    { emoji: "📱", label: "Device", color: "162 72% 45%" },
    { emoji: "🎓", label: "Education", color: "270 60% 60%" },
    { emoji: "🎯", label: "Other", color: "210 55% 47%" },
  ];

const GoalsPage = () => {
  const t = useTranslations("Goals");
  const { goals, loading, createGoal, contribute, removeGoal } = useGoals();
  const { wallet } = useWallet();
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
    category: CATEGORIES[0],
  });

  const handleCreateGoal = async () => {
    const targetAmount = Number(newGoal.target);

    if (!newGoal.title.trim()) {
      toast.error(t("errors.titleRequired"));
      return;
    }

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      toast.error(t("errors.invalidTarget"));
      return;
    }

    if (!newGoal.deadline) {
      toast.error(t("errors.deadlineRequired"));
      return;
    }

    const result = await createGoal({
      title: newGoal.title.trim(),
      emoji: newGoal.category.emoji,
      category: newGoal.category.label,
      target: targetAmount,
      deadline: newGoal.deadline,
      color: newGoal.category.color,
    });

    if (result.ok) {
      setShowNewForm(false);
      setNewGoal({
        title: "",
        target: "",
        deadline: "",
        category: CATEGORIES[0],
      });
    }
  };

  const handleContribute = async () => {
    if (!activeGoal) return;

    const amount = Number(topUpAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(t("errors.invalidAmount"));
      return;
    }

    if (wallet && Number(wallet.balance) < amount) {
      toast.error(t("errors.insufficientBalance"));
      return;
    }

    const result = await contribute(activeGoal.id, amount);

    if (result.ok) {
      setTopUpAmount("");
      setActiveGoal(null);
    }
  };

  const handleDeleteGoal = async () => {
    if (!activeGoal) return;

    const result = await removeGoal(activeGoal.id);

    if (result.ok) {
      setActiveGoal(null);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        </div>
        <Button
          onClick={() => setShowNewForm(true)}
          size="sm"
          className="gap-1.5 bg-gradient-accent shadow-glow"
        >
          <Plus className="h-4 w-4" /> {t("newGoal")}
        </Button>
      </header>

      <div className="flex items-start gap-3 rounded-2xl border border-primary-glow/30 bg-primary-glow/5 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
        <div>
          <p className="text-sm font-semibold">{t("insight.title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("insight.description")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => {
            const progress = (Number(goal.saved) / Number(goal.target)) * 100;
            const daysLeft = daysUntil(goal.deadline);
            return (
              <li key={goal.id}>
                <button
                  onClick={() => setActiveGoal(goal)}
                  className="glass-card flex w-full items-center gap-4 p-4 text-left transition-all hover:border-primary-glow/40"
                >
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <ProgressRing pct={progress} color={goal.color} size={80} />
                    <span className="absolute text-2xl">{goal.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold">{goal.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t("savedAmount", {
                        saved: Number(goal.saved).toLocaleString(),
                        target: Number(goal.target).toLocaleString(),
                      })}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="stat-pill bg-secondary text-foreground">
                        {progress.toFixed(0)}%
                      </span>
                      <span className="stat-pill bg-secondary text-muted-foreground">
                        <Calendar className="h-3 w-3" />{" "}
                        {t("daysLeft", { days: daysLeft })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Goal Details Modal */}
      {activeGoal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
          onClick={() => setActiveGoal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-elegant sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                {activeGoal.title}
              </h3>
              <button
                onClick={() => setActiveGoal(null)}
                className="rounded-full bg-secondary p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col items-center py-4">
              <div className="relative flex items-center justify-center">
                <ProgressRing
                  pct={
                    (Number(activeGoal.saved) / Number(activeGoal.target)) * 100
                  }
                  color={activeGoal.color}
                  size={160}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl">{activeGoal.emoji}</span>
                  <p className="mt-1 font-display text-2xl font-bold">
                    {(
                      (Number(activeGoal.saved) / Number(activeGoal.target)) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("saved")}
                </p>
                <p className="font-display text-lg font-bold">
                  EGP {Number(activeGoal.saved).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("target")}
                </p>
                <p className="font-display text-lg font-bold">
                  EGP {Number(activeGoal.target).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("dailyRequired")}
                </p>
                <p className="font-display text-lg font-bold gradient-text">
                  EGP {dailyRequired(activeGoal)}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("deadline")}
                </p>
                <p className="font-display text-lg font-bold">
                  {new Date(activeGoal.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("topUpAmount")}
              </label>
              <Input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="500"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                onClick={handleDeleteGoal}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" /> {t("delete")}
              </Button>
              <Button
                onClick={handleContribute}
                className="flex-1 bg-gradient-accent shadow-glow"
              >
                <Wallet className="h-4 w-4 mr-1" /> {t("topUp")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNewForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
          onClick={() => setShowNewForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-elegant sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{t("newGoal")}</h3>
              <button
                onClick={() => setShowNewForm(false)}
                className="rounded-full bg-secondary p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              {t("pickCategory")}
            </p>
            <div className="mb-5 grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setNewGoal({ ...newGoal, category: cat })}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
                    newGoal.category.label === cat.label
                      ? "border-primary-glow bg-primary-glow/10"
                      : "border-border bg-secondary",
                  )}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] font-semibold">
                    {t(`categories.${cat.label.toLowerCase()}`)}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Input
                placeholder={t("titlePlaceholder")}
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
              <Input
                type="number"
                placeholder={t("targetPlaceholder")}
                value={newGoal.target}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, target: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
            </div>

            <Button
              onClick={handleCreateGoal}
              className="mt-5 w-full bg-gradient-accent shadow-glow"
            >
              <Target className="h-4 w-4 mr-1" /> {t("create")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
