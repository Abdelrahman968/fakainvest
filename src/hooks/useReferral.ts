"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Referral = {
  user_id: string;
  code: string;
  total_earned: number;
  reward_per_signup: number;
};

export type ReferralSignup = {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  status: "Active" | "Pending" | "Inactive";
  earned: number;
  joined_at: string;
};

export const useReferral = () => {
  const { user } = useAuth();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [signups, setSignups] = useState<ReferralSignup[]>([]);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/referral");
      if (!res.ok) {
        throw new Error("Failed to fetch referral data");
      }
      const data = await res.json();
      setReferral(data.referral);
      setSignups(data.signups || []);
      setLink(data.link || "");
    } catch (err) {
      console.error("Error fetching referral:", err);
      setError("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const trackReferral = useCallback(
    async (code: string, userName: string, userEmail: string) => {
      try {
        const res = await fetch("/api/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "trackReferral",
            code,
            referredUserName: userName,
            referredUserEmail: userEmail,
          }),
        });
        return res.ok;
      } catch (err) {
        console.error("Error tracking referral:", err);
        return false;
      }
    },
    [],
  );

  const activateReferral = useCallback(
    async (signupId: string) => {
      try {
        const res = await fetch("/api/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "activateReferral",
            signupId,
          }),
        });
        if (res.ok) {
          await refresh();
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error activating referral:", err);
        return false;
      }
    },
    [refresh],
  );

  return {
    referral,
    signups,
    link,
    loading,
    error,
    refresh,
    trackReferral,
    activateReferral,
  };
};
