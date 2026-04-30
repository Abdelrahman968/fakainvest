"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  sending: boolean;
  isArabic: boolean;
}

export const MessageList = ({
  messages,
  sending,
  isArabic,
}: MessageListProps) => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2 scroll-smooth">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300",
            m.role === "user" ? "items-end" : "items-start",
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            {m.role === "assistant" && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-primary-glow/20 to-accent/20">
                <Bot className="h-3.5 w-3.5 text-accent" />
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              {new Date(m.created_at).toLocaleTimeString(
                isArabic ? "ar-EG" : "en-GB",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </p>
            {m.role === "user" && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-accent">
                <User className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
          <div
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
              m.role === "user"
                ? "bg-linear-to-br from-primary-glow to-accent text-primary-foreground shadow-glow"
                : "glass-card border border-border/50",
            )}
          >
            {m.text}
          </div>
        </div>
      ))}

      {sending && (
        <div className="flex items-start gap-2 animate-in fade-in duration-300">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-primary-glow/20 to-accent/20">
            <Bot className="h-3.5 w-3.5 text-accent" />
          </div>
          <div className="glass-card inline-flex items-center gap-1.5 rounded-2xl px-4 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-glow" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-glow [animation-delay:0.15s]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-glow [animation-delay:0.3s]" />
          </div>
        </div>
      )}
    </div>
  );
};
