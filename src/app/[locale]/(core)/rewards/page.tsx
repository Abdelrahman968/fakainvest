"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Flame,
  Users,
  Sparkles,
  Crown,
  Loader2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRewards } from "@/hooks/useRewards";

type Tab = "Badges" | "Challenges" | "Leaderboard";

const rarityStyle = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return {
        ring: "border-muted-foreground/40",
        text: "text-muted-foreground",
      };
    case "Rare":
      return { ring: "border-primary-glow/60", text: "text-primary-glow" };
    case "Epic":
      return { ring: "border-accent/70", text: "text-accent" };
    case "Legendary":
      return { ring: "border-warning/80", text: "text-warning" };
    default:
      return { ring: "border-border", text: "text-foreground" };
  }
};

const Rewards = () => {
  const translate = useTranslations("Rewards");
  const {
    reward,
    challenges,
    badges,
    leaderboard,
    userRank,
    loading,
    joinChallenge,
  } = useRewards();
  const [tab, setTab] = useState<Tab>("Badges");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const earnedCount = badges.filter((b) =>
    reward?.badges.includes(b.id),
  ).length;

  const handleJoinChallenge = async (challengeId: string) => {
    setJoiningId(challengeId);
    const success = await joinChallenge(challengeId);
    setJoiningId(null);
    if (success) {
      toast.success(translate("challengeJoined"));
    } else {
      toast.error(translate("joinFailed"));
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/more"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {translate("subtitle")}
          </p>
          <h1 className="font-display text-2xl font-bold">
            {translate("title")}
          </h1>
        </div>
      </header>

      {/* Streak hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-warning/30 p-5"
        style={{ background: "var(--gradient-gold)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/30 backdrop-blur">
            <Flame className="h-8 w-8 text-background" />
          </div>
          <div className="flex-1 text-background">
            <p className="text-xs font-semibold opacity-80">
              {translate("currentStreak")}
            </p>
            <p className="font-display text-3xl font-bold">
              {reward?.streakDays || 0} {translate("days")} 🔥
            </p>
            <p className="text-xs opacity-80">
              {earnedCount} / {badges.length} {translate("badgesEarned")}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-full border border-border/60 bg-card/60 p-1">
        <button
          onClick={() => setTab("Badges")}
          className={`rounded-full py-2 text-xs font-semibold transition-all ${
            tab === "Badges"
              ? "bg-gradient-accent text-primary-foreground shadow-glow"
              : "text-muted-foreground"
          }`}
        >
          {translate("badges")}
        </button>
        <button
          onClick={() => setTab("Challenges")}
          className={`rounded-full py-2 text-xs font-semibold transition-all ${
            tab === "Challenges"
              ? "bg-gradient-accent text-primary-foreground shadow-glow"
              : "text-muted-foreground"
          }`}
        >
          {translate("challenges")}
        </button>
        <button
          onClick={() => setTab("Leaderboard")}
          className={`rounded-full py-2 text-xs font-semibold transition-all ${
            tab === "Leaderboard"
              ? "bg-gradient-accent text-primary-foreground shadow-glow"
              : "text-muted-foreground"
          }`}
        >
          {translate("leaderboard")}
        </button>
      </div>

      {tab === "Badges" && (
        <section>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => {
              const earned = reward?.badges.includes(b.id);
              const s = rarityStyle(b.rarity);
              return (
                <button
                  key={b.id}
                  onClick={() =>
                    toast(b.name, {
                      description: earned
                        ? `${b.description}`
                        : `🔒 ${translate("locked")} — ${b.description}`,
                    })
                  }
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 ${s.ring} bg-card/70 p-3 text-center transition-all hover:scale-105 ${
                    !earned && "opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl">{b.emoji}</span>
                  <span className="font-display text-[11px] font-semibold leading-tight">
                    {b.name}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-wide ${s.text}`}
                  >
                    {b.rarity}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {tab === "Challenges" && (
        <section className="space-y-3">
          {challenges.map((c) => {
            const isCompleted = reward?.completedChallenges.includes(c._id);
            return (
              <article
                key={c._id}
                className={`rounded-3xl border border-border/60 bg-card/70 p-4 ${isCompleted ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ background: "hsl(var(--accent) / 0.15)" }}
                  >
                    {c.emoji}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display font-semibold leading-tight">
                        {c.title}
                      </p>
                      <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                        {c.durationDays} {translate("daysLeft")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                      <Sparkles className="h-3 w-3" /> {c.reward}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between text-[11px]">
                    <span className="font-semibold">
                      {c.target} / {c.target}
                    </span>
                    <span className="text-muted-foreground">
                      <Users className="mr-1 inline h-3 w-3" />
                      {c.participants.toLocaleString()} {translate("joined")}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
                    <div
                      className="h-full rounded-full bg-gradient-accent transition-all"
                      style={{ width: `${Math.min(100, 0)}%` }}
                    />
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => handleJoinChallenge(c._id)}
                      disabled={joiningId === c._id}
                      className="mt-3 w-full rounded-xl bg-gradient-accent py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[0.98]"
                    >
                      {joiningId === c._id ? (
                        <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                      ) : (
                        translate("joinChallenge")
                      )}
                    </button>
                  )}
                  {isCompleted && (
                    <p className="mt-3 text-center text-[10px] text-accent">
                      {translate("completed")}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {tab === "Leaderboard" && (
        <section className="space-y-2">
          <p className="px-1 text-xs text-muted-foreground">
            {translate("leaderboardDesc")}
          </p>
          {leaderboard.map((entry) => (
            <article
              key={entry.userId}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                entry.isYou
                  ? "border-primary-glow bg-primary-glow/10"
                  : "border-border/60 bg-card/60"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold ${
                  entry.rank === 1
                    ? "bg-warning text-background"
                    : entry.rank === 2
                      ? "bg-muted-foreground/30 text-foreground"
                      : entry.rank === 3
                        ? "bg-warning/40 text-background"
                        : "bg-secondary text-muted-foreground"
                }`}
              >
                {entry.rank === 1 ? <Crown className="h-4 w-4" /> : entry.rank}
              </div>
              <span className="text-2xl">{entry.avatar}</span>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">
                  {entry.name}
                  {entry.isYou && (
                    <span className="ml-2 rounded-full bg-primary-glow/20 px-2 py-0.5 text-[10px] font-semibold text-primary-glow">
                      {translate("you")}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-bold gradient-text">
                  {entry.score.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {translate("points")}
                </p>
              </div>
            </article>
          ))}
          {userRank && userRank > 10 && (
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              {translate("yourRank")}: #{userRank}
            </p>
          )}
          <p className="pt-2 text-center text-[10px] text-muted-foreground">
            <Trophy className="mr-1 inline h-3 w-3" />
            {translate("earnPointsDesc")}
          </p>
        </section>
      )}
    </div>
  );
};

export default Rewards;
