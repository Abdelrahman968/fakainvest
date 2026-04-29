"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Bell,
  Check,
  ChevronRight,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  UserIcon,
  Wallet,
  Cat,
  Rabbit,
  Bird,
  Turtle,
  Users,
  Sparkles,
  Squirrel,
  Crown,
  Feather,
  Dog,
  Zap,
  Star,
} from "lucide-react";
import { user as defaultUser } from "@/lib/mockData";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const AVATARS = [
  { icon: UserIcon, name: "user" },
  { icon: Squirrel, name: "fox" },
  { icon: Cat, name: "cat" },
  { icon: Rabbit, name: "rabbit" },
  { icon: Crown, name: "lion" },
  { icon: Feather, name: "penguin" },
  { icon: Dog, name: "wolf" },
  { icon: Bird, name: "bird" },
  { icon: Turtle, name: "turtle" },
  { icon: Zap, name: "dragon" },
  { icon: Star, name: "unicorn" },
  { icon: Users, name: "group" },
  { icon: Sparkles, name: "sparkles" },
];

const Profile = () => {
  const router = useRouter();
  const t = useTranslations("ProfilePage");
  const { profile, loading, update } = useProfile();
  const { signOut } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDraft({
        name: profile.display_name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initial = (profile.display_name || profile.email || "U")
    .charAt(0)
    .toUpperCase();

  const getAvatarIcon = (avatarName: string) => {
    const found = AVATARS.find((a) => a.name === avatarName);
    if (found) {
      const IconComponent = found.icon;
      return <IconComponent className="h-8 w-8" />;
    }
    return <UserIcon className="h-8 w-8" />;
  };

  const items = [
    {
      icon: Wallet,
      label: t("items.linkedAccounts"),
      value: t("items.linkedAccountsValue"),
      onClick: () => toast(t("toasts.linkingComingSoon")),
    },
    {
      icon: Bell,
      label: t("items.notifications"),
      value: profile.notifications_enabled ? t("items.on") : t("items.off"),
      isSwitch: true,
      onClick: async () => {
        await update({ notifications_enabled: !profile.notifications_enabled });
      },
    },
    {
      icon: Lock,
      label: t("items.security"),
      value: t("items.securityValue"),
      onClick: () => toast(t("toasts.securityComingSoon")),
    },
    {
      icon: HelpCircle,
      label: t("items.help"),
      value: "",
      onClick: () => toast(t("toasts.supportEmail")),
    },
  ];

  const openEdit = () => {
    setDraft({
      name: profile.display_name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
    });
    setEditOpen(true);
  };

  const saveProfile = async () => {
    const name = (draft.name || "").trim();
    const email = (draft.email || "").trim();
    const phone = (draft.phone || "").trim();

    if (name.length < 2 || name.length > 40) {
      toast.error(t("validation.nameLength"));
      return;
    }
    if (!/^[\p{L}\p{M}''.\- ]+$/u.test(name)) {
      toast.error(t("validation.nameChars"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 80) {
      toast.error(t("validation.email"));
      return;
    }
    if (phone && !/^[+\d\s()-]{6,20}$/.test(phone)) {
      toast.error(t("validation.phone"));
      return;
    }

    const oldEmail = profile.email;
    const emailChanged = email !== oldEmail;

    setSaving(true);
    const result = await update({
      display_name: name,
      email,
      phone,
    });
    setSaving(false);

    if (result.ok === false) {
      toast.error(result.error);
      return;
    }

    setEditOpen(false);

    if (emailChanged) {
      toast.success(t("toasts.emailUpdated"), {
        description: t("toasts.emailChangedDescription", { email }),
        duration: 5000,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">{t("header.subtitle")}</p>
        <h1 className="font-display text-3xl font-bold">{t("header.title")}</h1>
      </header>

      <div className="glass-card flex items-center gap-4 p-5">
        <button
          onClick={() => setAvatarOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent font-display text-3xl font-bold text-primary-foreground shadow-glow"
          aria-label={t("aria.changeAvatar")}
        >
          {profile.avatar_icon ? (
            getAvatarIcon(profile.avatar_icon)
          ) : (
            <span className="text-3xl">{initial}</span>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary-glow">
            <Pencil className="h-3 w-3 text-primary-foreground" />
          </span>
        </button>
        <div className="flex-1">
          <p className="font-display text-lg font-bold">
            {profile.display_name || t("common.addName")}
          </p>
          <p className="text-xs text-muted-foreground">{profile.email}</p>
          {profile.phone && (
            <p className="text-[11px] text-muted-foreground">{profile.phone}</p>
          )}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-warning">
            <Award className="h-3 w-3" /> {defaultUser.badge}
          </div>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center gap-1 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
        >
          <Pencil className="h-3 w-3" /> {t("buttons.edit")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="font-display text-xl font-bold gradient-text">
            {defaultUser.joinedDays}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("stats.daysActive")}
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="font-display text-xl font-bold gradient-text">
            {defaultUser.streak}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("stats.streak")}
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="font-display text-xl font-bold gradient-text">
            {defaultUser.healthScore}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("stats.score")}
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map(({ icon: Icon, label, value, onClick, isSwitch }) => (
          <li key={label}>
            {isSwitch ? (
              <div className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5 text-primary-glow" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{label}</p>
                  {value && (
                    <p className="text-xs text-muted-foreground">{value}</p>
                  )}
                </div>
                <Switch
                  checked={profile.notifications_enabled}
                  onCheckedChange={(v) => update({ notifications_enabled: v })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <button
                onClick={onClick}
                className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 text-left transition-colors hover:bg-card/80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5 text-primary-glow" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{label}</p>
                  {value && (
                    <p className="text-xs text-muted-foreground">{value}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-semibold text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> {t("buttons.signOut")}
      </button>

      <p className="pb-4 text-center text-[10px] text-muted-foreground">
        {t("footer.version")}
      </p>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
          <SheetHeader>
            <SheetTitle className="font-display flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary-glow" />
              {t("editProfile.title")}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                {t("editProfile.displayName")}
              </label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                maxLength={40}
                className="h-11 rounded-2xl"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                {t("editProfile.email")}
              </label>
              <Input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                maxLength={80}
                className="h-11 rounded-2xl"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {t("editProfile.emailNote")}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                {t("editProfile.phone")}
              </label>
              <Input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                maxLength={20}
                placeholder={t("editProfile.phonePlaceholder")}
                className="h-11 rounded-2xl"
              />
            </div>
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("buttons.saveChanges")
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={avatarOpen} onOpenChange={setAvatarOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border/60">
          <SheetHeader>
            <SheetTitle className="font-display">
              {t("avatarPicker.title")} - Beta
            </SheetTitle>
          </SheetHeader>
          <div className="mt-5 grid grid-cols-6 gap-3 pb-2">
            {AVATARS.map(({ icon: Icon, name }) => {
              const active = profile.avatar_icon === name;
              return (
                <button
                  key={name}
                  onClick={async () => {
                    await update({ avatar_icon: name });
                    setAvatarOpen(false);
                    toast.success(t("toasts.avatarUpdated"));
                  }}
                  className={`relative flex h-14 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-primary-glow/20 ring-2 ring-primary-glow"
                      : "bg-card/60 ring-1 ring-border/40 hover:ring-primary-glow/60"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {active && (
                    <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary-glow p-0.5 text-primary-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Profile;
