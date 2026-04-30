"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export type Rule = {
  id: string;
  user_id: string;
  trigger_text: string;
  trigger_emoji: string;
  action_text: string;
  action_emoji: string;
  enabled: boolean;
  triggered_count: number;
  created_at: string;
  updated_at: string;
};

export type RuleTemplate = {
  trigger: string;
  action: string;
  triggerEmoji: string;
  actionEmoji: string;
};

export const useRules = () => {
  const t = useTranslations("Rules");
  const { user } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [templates, setTemplates] = useState<RuleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      if (isMounted.current) {
        setRules([]);
        setLoading(false);
      }
      return;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const [rulesRes, templatesRes] = await Promise.all([
        fetch("/api/rules", { signal: controller.signal }),
        fetch("/api/rules/templates", { signal: controller.signal }),
      ]);

      clearTimeout(timeoutId);

      if (!isMounted.current) return;

      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setRules(rulesData.rules || []);
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }
    } catch (err) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : "Failed to fetch rules");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (id: string, enabled: boolean): Promise<boolean> => {
      if (!user) return false;

      try {
        const res = await fetch(`/api/rules/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled }),
        });

        if (!res.ok) return false;

        const data = await res.json();
        setRules((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, enabled: data.rule.enabled } : r,
          ),
        );

        toast.success(enabled ? t("success.enabled") : t("success.disabled"));
        return true;
      } catch (err) {
        console.error("Toggle rule error:", err);
        return false;
      }
    },
    [user, t],
  );

  const create = useCallback(
    async (
      triggerText: string,
      actionText: string,
      triggerEmoji = "⚡",
      actionEmoji = "✨",
    ): Promise<boolean> => {
      if (!user) return false;

      try {
        const res = await fetch("/api/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            triggerText,
            actionText,
            triggerEmoji,
            actionEmoji,
          }),
        });

        if (!res.ok) return false;

        const data = await res.json();
        setRules((prev) => [...prev, data.rule]);
        toast.success(t("success.created"));
        return true;
      } catch (err) {
        console.error("Create rule error:", err);
        return false;
      }
    },
    [user, t],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const res = await fetch(`/api/rules/${id}`, { method: "DELETE" });
        if (!res.ok) return false;

        setRules((prev) => prev.filter((r) => r.id !== id));
        toast.success(t("success.deleted"));
        return true;
      } catch (err) {
        console.error("Delete rule error:", err);
        return false;
      }
    },
    [user, t],
  );

  return {
    rules,
    templates,
    loading,
    error,
    refresh,
    toggle,
    create,
    remove,
  };
};
