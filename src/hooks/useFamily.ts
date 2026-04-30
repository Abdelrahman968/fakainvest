"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type FamilyMember = {
  _id: string;
  parentUserId: string;
  name: string;
  emoji: string;
  role: string;
  allowance: number;
  balance: number;
  weeklyLimit: number;
  spentThisWeek: number;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type FamilyChore = {
  _id: string;
  memberId: string | null;
  parentUserId: string;
  title: string;
  reward: number;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useFamily = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [chores, setChores] = useState<FamilyChore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setMembers([]);
      setChores([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/family");
      if (!res.ok) {
        throw new Error("Failed to fetch family data");
      }
      const data = await res.json();
      setMembers(data.members || []);
      setChores(data.chores || []);
    } catch (err) {
      console.error("Error fetching family data:", err);
      setError("Failed to load family data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMember = useCallback(
    async (
      name: string,
      emoji: string,
      role: string,
      allowance: number,
      weeklyLimit?: number,
      color?: string,
    ) => {
      if (!user) return;

      try {
        const res = await fetch("/api/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "addMember",
            data: { name, emoji, role, allowance, weeklyLimit, color },
          }),
        });
        const data = await res.json();
        if (res.ok && data.member) {
          setMembers((prev) => [...prev, data.member]);
        }
      } catch (err) {
        console.error("Error adding member:", err);
      }
    },
    [user],
  );

  const sendAllowance = useCallback(
    async (
      memberId: string,
      amount: number,
    ): Promise<{ ok: boolean; reason?: string }> => {
      if (!user) return { ok: false, reason: "Not signed in" };

      try {
        const res = await fetch("/api/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "sendAllowance",
            data: { memberId, amount },
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            reason: data.error || "Failed to send allowance",
          };
        }
        if (data.member) {
          setMembers((prev) =>
            prev.map((m) => (m._id === memberId ? data.member : m)),
          );
        }
        return { ok: true };
      } catch (err) {
        console.error("Error sending allowance:", err);
        return { ok: false, reason: "Network error" };
      }
    },
    [user],
  );

  const toggleChore = useCallback(
    async (choreId: string, done: boolean) => {
      if (!user) return;

      try {
        const res = await fetch("/api/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "toggleChore",
            data: { choreId, done },
          }),
        });
        const data = await res.json();
        if (res.ok && data.chore) {
          setChores((prev) =>
            prev.map((c) => (c._id === choreId ? data.chore : c)),
          );
          if (done === true) {
            refresh();
          }
        }
      } catch (err) {
        console.error("Error toggling chore:", err);
      }
    },
    [user, refresh],
  );

  const addChore = useCallback(
    async (title: string, reward: number, memberId?: string) => {
      if (!user) return;

      try {
        const res = await fetch("/api/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "addChore",
            data: { memberId: memberId || null, title, reward },
          }),
        });
        const data = await res.json();
        if (res.ok && data.chore) {
          setChores((prev) => [...prev, data.chore]);
        }
      } catch (err) {
        console.error("Error adding chore:", err);
      }
    },
    [user],
  );

  const deleteMember = useCallback(
    async (memberId: string) => {
      if (!user) return;

      try {
        const res = await fetch(`/api/family?type=member&id=${memberId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setMembers((prev) => prev.filter((m) => m._id !== memberId));
          setChores((prev) => prev.filter((c) => c.memberId !== memberId));
        }
      } catch (err) {
        console.error("Error deleting member:", err);
      }
    },
    [user],
  );

  const deleteChore = useCallback(
    async (choreId: string) => {
      if (!user) return;

      try {
        const res = await fetch(`/api/family?type=chore&id=${choreId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setChores((prev) => prev.filter((c) => c._id !== choreId));
        }
      } catch (err) {
        console.error("Error deleting chore:", err);
      }
    },
    [user],
  );

  return {
    members,
    chores,
    loading,
    error,
    refresh,
    addMember,
    sendAllowance,
    toggleChore,
    addChore,
    deleteMember,
    deleteChore,
  };
};
