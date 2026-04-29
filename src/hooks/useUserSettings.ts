"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type RoundUpMode = "None" | "Eco" | "Boost" | "Fixed20" | "Custom";

export interface UserSettingsType {
  roundUpMode: RoundUpMode;
  roundUpEnabled: boolean;
  customRoundUpAmount: number;
  roundUpAutoInvestThreshold: number;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/settings");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      let roundUpMode = data.roundUpMode || "Eco";
      if (roundUpMode === "Normal") roundUpMode = "Eco";
      if (roundUpMode === "Medium") roundUpMode = "Boost";
      if (roundUpMode === "Aggressive") roundUpMode = "Fixed20";

      const newSettings = {
        roundUpMode: roundUpMode as RoundUpMode,
        roundUpEnabled: data.roundUpEnabled ?? true,
        customRoundUpAmount: data.customRoundUpAmount ?? 10,
        roundUpAutoInvestThreshold: data.roundUpAutoInvestThreshold ?? 20,
      };

      setSettings(newSettings);
    } catch (err) {
      console.error("❌ Error loading settings:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
      setSettings({
        roundUpMode: "Eco",
        roundUpEnabled: true,
        customRoundUpAmount: 10,
        roundUpAutoInvestThreshold: 20,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(
    async (patch: Partial<UserSettingsType>) => {
      if (!user) return;
      console.log("📤 Updating settings with:", patch);

      try {
        const res = await fetch("/api/user/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const newSettings = {
          roundUpMode: data.roundUpMode || "Eco",
          roundUpEnabled: data.roundUpEnabled ?? true,
          customRoundUpAmount: data.customRoundUpAmount ?? 10,
          roundUpAutoInvestThreshold: data.roundUpAutoInvestThreshold ?? 20,
        };

        setSettings(newSettings);
        return newSettings;
      } catch (err) {
        console.error("Error updating settings:", err);
        throw err;
      }
    },
    [user],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, refresh, updateSettings };
};
