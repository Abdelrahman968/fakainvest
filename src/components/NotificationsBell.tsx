import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const typeAccent: Record<Notification["type"], string> = {
  alert: "warning",
  milestone: "accent",
  ai: "primary-glow",
  social: "primary",
};

const timeAgo = (iso: string) => {
  const s = Math.max(
    1,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const NotificationsBell = () => {
  const { items, loading, unreadCount, markAllRead, markRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Notifications");

  // حساب هل الإشعار غير مقروء بناءً على readAt
  const isUnread = (notification: Notification) => !notification.readAt;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 transition-colors hover:bg-secondary"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[360px] max-w-[92vw] rounded-2xl border-border/60 bg-popover/95 p-0 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <p className="font-display text-sm font-semibold">{t("title")}</p>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary-glow transition-colors hover:text-primary-glow/80"
            >
              <Check className="h-3 w-3" /> {t("markAllRead")}
            </button>
          )}
        </div>
        <ul className="max-h-[440px] overflow-y-auto">
          {loading && (
            <li className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </li>
          )}
          {!loading && items.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-muted-foreground">
              {t("empty")}
            </li>
          )}
          {items.map((n) => (
            <li
              key={n.id}
              onClick={() => isUnread(n) && markRead(n.id)}
              className={cn(
                "cursor-pointer transition-all duration-200",
                "border-b border-border/40 px-4 py-3",
                "hover:bg-secondary/50",
                "last:border-0",
                isUnread(n) && "bg-primary-glow/5 hover:bg-primary-glow/10",
              )}
            >
              <div className="flex gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                  style={{
                    background: `hsl(var(--${typeAccent[n.type]}) / 0.15)`,
                  }}
                >
                  {n.emoji}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold leading-tight">
                      {n.title}
                    </p>
                    {isUnread(n) && (
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary-glow" />
                    )}
                  </div>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {n.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
