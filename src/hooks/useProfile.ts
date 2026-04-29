import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Profile = {
  id: string;
  display_name: string;
  email: string;
  phone: string;
  avatar_icon: string;
  notifications_enabled: boolean;
  created_at?: string;
};

export const useProfile = () => {
  const { user, signOut, refreshUser } = useAuth();
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
      const data = await res.json();

      if (res.ok && data.profile) {
        setProfile(data.profile);
      } else {
        setProfile({
          id: user.id,
          display_name: user.displayName || user.email,
          email: user.email,
          phone: user.phone || "",
          avatar_icon: user.avatarEmoji || "🦋",
          notifications_enabled: user.notificationsEnabled ?? true,
        });
      }
    } catch (err) {
      console.error("[useProfile] Error fetching:", err);
      setProfile({
        id: user.id,
        display_name: user.displayName || user.email,
        email: user.email,
        phone: user.phone || "",
        avatar_icon: user.avatarEmoji || "🦋",
        notifications_enabled: user.notificationsEnabled ?? true,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refresh();
  }, [user, refresh]);

  const update = useCallback(
    async (patch: Partial<Omit<Profile, "id">>) => {
      if (!user) return { ok: false, error: "Not signed in" };

      const oldEmail = profile?.email;
      const emailChanged = patch.email && patch.email !== oldEmail;

      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });

        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data.error || "Update failed" };
        }

        setProfile(data.profile);

        if (emailChanged && data.profile.email) {
          await refreshUser();

          toast.success("Email updated successfully!", {
            description: `Your email has been changed to ${data.profile.email}`,
            duration: 5000,
          });
        } else {
          toast.success("Profile updated successfully");
        }

        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
    [user, profile?.email, refreshUser],
  );

  return { profile, loading, refresh, update };
};
