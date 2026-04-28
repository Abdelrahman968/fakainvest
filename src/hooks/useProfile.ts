"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Profile = {
  id: string;
  display_name: string;
  email: string;
  phone: string;
  avatar_emoji: string;
  notifications_enabled: boolean;
  created_at?: string;
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/profile");

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else {
        setProfile({
          id: user.id,
          display_name: user.displayName || user.name || user.email,
          email: user.email,
          phone: user.phone || "",
          avatar_emoji: user.avatarEmoji || "🦋",
          notifications_enabled: user.notificationsEnabled ?? true,
        });
      }
    } catch (err) {
      console.error("[useProfile] Error fetching:", err);
      setProfile({
        id: user.id,
        display_name: user.displayName || user.name || user.email,
        email: user.email,
        phone: user.phone || "",
        avatar_emoji: user.avatarEmoji || "🦋",
        notifications_enabled: user.notificationsEnabled ?? true,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      refresh();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [user, refresh]);

  const update = useCallback(
    async (patch: Partial<Omit<Profile, "id">>) => {
      if (!user) return { ok: false, error: "Not signed in" };
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data.error || "Update failed" };
        setProfile(data.profile);
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
    [user],
  );

  return { profile, loading, refresh, update };
};
