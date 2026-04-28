"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sigma } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signUpSchema, signInSchema } from "@/lib/validators";
import { useTranslations } from "next-intl";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, refreshUser } = useAuth();
  const t = useTranslations("Auth");

  const from = searchParams.get("from") ?? "/dashboard";

  const [mode, setMode] = useState<Mode>("signin");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace(from);
    }
  }, [loading, user, from, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ displayName, email, password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error ?? t("errors.signupFailed"));
          return;
        }

        await refreshUser();
        toast.success(t("welcome"), {
          description: t("accountCreated"),
        });
        router.replace(from);
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }

        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error ?? t("errors.signinFailed"));
          return;
        }

        await refreshUser();
        toast.success(t("welcomeBack"));
        router.replace(from);
      }
    } catch {
      toast.error(t("errors.networkError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
            <Sigma
              className="h-6 w-6 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <div>
            <p className="font-display text-xl font-bold leading-none">
              {t("appName")}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t("appDescription")}
            </p>
          </div>
        </Link>

        <div className="glass-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold">
              {mode === "signin" ? t("welcomeBack") : t("createAccount")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? t("signinDescription")
                : t("signupDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-xs font-semibold text-muted-foreground"
                >
                  {t("displayName")}
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("displayNamePlaceholder")}
                  maxLength={40}
                  autoComplete="name"
                  className="h-11 rounded-2xl"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-semibold text-muted-foreground"
              >
                {t("email")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                maxLength={80}
                autoComplete="email"
                className="h-11 rounded-2xl"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-semibold text-muted-foreground"
              >
                {t("password")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signup" ? t("passwordPlaceholder") : "••••••••"
                  }
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  className="h-11 rounded-2xl pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-all ease-in-out duration-300"
                  aria-label={showPwd ? t("hidePassword") : t("showPassword")}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-2xl bg-gradient-accent font-display font-semibold shadow-glow transition-all ease-in-out duration-300 hover:scale-101 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signin" ? (
                t("signinButton")
              ) : (
                t("signupButton")
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? t("noAccount") : t("hasAccount")}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary-glow hover:underline cursor-pointer"
            >
              {mode === "signin" ? t("createOne") : t("signin")}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          {t("termsAgreement")}
        </p>
      </div>
    </div>
  );
}
