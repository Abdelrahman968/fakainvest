"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Wallet, X, Loader2, Send, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFamily, type FamilyMember } from "@/hooks/useFamily";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const fmt = (n: number) =>
  Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });

const Family = () => {
  const t = useTranslations("Family");
  const {
    members,
    chores,
    loading,
    addMember,
    sendAllowance,
    toggleChore,
    addChore,
  } = useFamily();
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [amount, setAmount] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    emoji: "👤",
    role: "Child",
    allowance: "",
  });
  const [showChore, setShowChore] = useState(false);
  const [choreDraft, setChoreDraft] = useState({ title: "", reward: "" });

  const totalBalance = members.reduce((s, m) => s + Number(m.balance), 0);
  const totalAllowance = members.reduce((s, m) => s + Number(m.allowance), 0);

  const sendNow = async () => {
    if (!selected) return;
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0)
      return toast.error(t("invalidAmount"));
    const r = await sendAllowance(selected._id, amt);
    if (r.ok === false) return toast.error(r.reason);
    toast.success(t("sentSuccess", { amount: fmt(amt), name: selected.name }));
    setAmount("");
    setSelected(null);
  };

  const submitMember = async () => {
    if (!draft.name.trim()) return toast.error(t("addName"));
    await addMember(
      draft.name.trim(),
      draft.emoji,
      draft.role,
      Number(draft.allowance) || 0,
    );
    setShowAdd(false);
    setDraft({ name: "", emoji: "👤", role: "Child", allowance: "" });
    toast.success(t("memberAdded"));
  };

  const submitChore = async () => {
    if (!choreDraft.title.trim()) return toast.error(t("addTitle"));
    await addChore(choreDraft.title.trim(), Number(choreDraft.reward) || 0);
    setShowChore(false);
    setChoreDraft({ title: "", reward: "" });
    toast.success(t("choreAdded"));
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
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
        </div>
      </header>

      <section
        className="relative overflow-hidden rounded-3xl border border-primary-glow/30 p-5"
        style={{ background: "var(--gradient-hero)" }}
      >
        <p className="text-xs uppercase tracking-wide text-primary-foreground/70">
          {t("familyBalances")}
        </p>
        <p className="font-display text-3xl font-bold text-primary-foreground">
          EGP {fmt(totalBalance)}
        </p>
        <p className="text-xs text-primary-foreground/70">
          {t("totalAllowance")}: EGP {fmt(totalAllowance)}
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{t("members")}</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold"
          >
            <Plus className="h-3 w-3" /> {t("addMember")}
          </button>
        </div>

        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m._id}>
              <button
                onClick={() => {
                  setSelected(m);
                  setAmount(String(m.allowance));
                }}
                className="flex w-full items-center gap-3 rounded-3xl border border-border/60 bg-card/70 p-4 text-left transition-all hover:border-primary-glow/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-glow/10 text-2xl">
                  {m.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold">
                    EGP {fmt(Number(m.balance))}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("allowance")} EGP {fmt(Number(m.allowance))}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{t("chores")}</h2>
          <button
            onClick={() => setShowChore(true)}
            className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold"
          >
            <Plus className="h-3 w-3" /> {t("newChore")}
          </button>
        </div>
        <ul className="space-y-2">
          {chores.map((c) => (
            <li
              key={c._id}
              className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-3"
            >
              <button
                onClick={() => toggleChore(c._id, !c.done)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-colors ${
                  c.done
                    ? "border-accent bg-accent text-primary-foreground"
                    : "border-border"
                }`}
              >
                {c.done && <Check className="h-3.5 w-3.5" />}
              </button>
              <span
                className={`flex-1 text-sm ${c.done && "line-through text-muted-foreground"}`}
              >
                {c.title}
              </span>
              <span className="font-display text-sm font-bold text-accent">
                +EGP {fmt(Number(c.reward))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 font-display text-xl">
                  <span className="text-3xl">{selected.emoji}</span>
                  {selected.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    {t("currentBalance")}
                  </p>
                  <p className="font-display text-2xl font-bold gradient-text">
                    EGP {fmt(Number(selected.balance))}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    {t("sendAmount")}
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 h-11 rounded-2xl"
                    placeholder="100"
                  />
                </div>
                <Button
                  onClick={sendNow}
                  className="h-12 w-full rounded-2xl bg-gradient-accent font-semibold shadow-glow"
                >
                  <Send className="h-4 w-4" /> {t("sendAllowance")}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Member Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
          onClick={() => setShowAdd(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                {t("addMember")}
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-full bg-secondary p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {["👤", "🧔", "👩", "👧", "👦", "👶", "🧓", "🐶", "🐱"].map(
                  (e) => (
                    <button
                      key={e}
                      onClick={() => setDraft({ ...draft, emoji: e })}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${draft.emoji === e ? "bg-primary-glow/20 ring-2 ring-primary-glow" : "bg-secondary"}`}
                    >
                      {e}
                    </button>
                  ),
                )}
              </div>
              <Input
                placeholder={t("namePlaceholder")}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="h-11 rounded-2xl"
              />
              <Input
                placeholder={t("rolePlaceholder")}
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="h-11 rounded-2xl"
              />
              <Input
                type="number"
                placeholder={t("allowancePlaceholder")}
                value={draft.allowance}
                onChange={(e) =>
                  setDraft({ ...draft, allowance: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
              <Button
                onClick={submitMember}
                className="w-full bg-gradient-accent shadow-glow"
              >
                {t("addMemberBtn")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Chore Modal */}
      {showChore && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center"
          onClick={() => setShowChore(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                {t("newChore")}
              </h3>
              <button
                onClick={() => setShowChore(false)}
                className="rounded-full bg-secondary p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder={t("chorePlaceholder")}
                value={choreDraft.title}
                onChange={(e) =>
                  setChoreDraft({ ...choreDraft, title: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
              <Input
                type="number"
                placeholder={t("rewardPlaceholder")}
                value={choreDraft.reward}
                onChange={(e) =>
                  setChoreDraft({ ...choreDraft, reward: e.target.value })
                }
                className="h-11 rounded-2xl"
              />
              <Button
                onClick={submitChore}
                className="w-full bg-gradient-accent shadow-glow"
              >
                {t("addChoreBtn")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;
