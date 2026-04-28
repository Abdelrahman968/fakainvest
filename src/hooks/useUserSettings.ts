"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<{ roundUpMode: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(
    async (patch: { roundUpMode: string }) => {
      if (!user) return;
      try {
        const res = await fetch("/api/user/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refresh();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [refresh]);

  return { settings, loading, refresh, updateSettings };
};
