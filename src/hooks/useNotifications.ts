"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  emoji: string;
  type: "alert" | "milestone" | "ai" | "social";
  readAt: string | null;
  created_at: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    console.log(
      "🔔 [useNotifications] Fetching notifications for user:",
      user.id,
    );
    setLoading(true);

    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        console.log(
          "🔔 [useNotifications] Notifications received:",
          data.notifications?.length,
        );
        setItems(data.notifications || []);
      } else {
        console.log(
          "🔔 [useNotifications] Failed to fetch notifications:",
          res.status,
        );
        setItems([]);
      }
    } catch (error) {
      console.error("🔔 [useNotifications] Error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      refresh();
    }, 0);
    return () => clearTimeout(timeout);
  }, [refresh]);

  const unreadCount = items.filter((n) => !n.readAt).length;

  const markAllRead = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const serverTime = data.readAt || new Date().toISOString();
        setItems((arr) => arr.map((n) => ({ ...n, readAt: serverTime })));
      } else {
        console.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const serverTime = data.readAt || new Date().toISOString();
        setItems((arr) =>
          arr.map((n) => (n.id === id ? { ...n, readAt: serverTime } : n)),
        );
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const push = async (
    n: Omit<Notification, "id" | "user_id" | "created_at" | "readAt">,
  ) => {
    if (!user) return;

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          setItems((arr) => [data.notification, ...arr]);
        }
      }
    } catch (error) {
      console.error("Error pushing notification:", error);
    }
  };

  return { items, loading, unreadCount, refresh, markAllRead, markRead, push };
};
