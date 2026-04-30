"use client";

import { Bot, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatHeaderProps {
  messagesCount: number;
  onClear: () => void;
}

export const ChatHeader = ({ messagesCount, onClear }: ChatHeaderProps) => {
  const t = useTranslations("Chat");

  return (
    <header className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-2xl bg-card/60 p-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary-glow to-accent shadow-glow">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-cairo text-lg font-bold bg-linear-to-r from-primary-glow to-accent bg-clip-text text-transparent">
            فكا-بوت
          </h1>
          <p className="text-[10px] text-accent flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {t("online")} · {t("financialAdvisor")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {messagesCount > 0 && (
          <button
            onClick={onClear}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            aria-label={t("clearChat")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
