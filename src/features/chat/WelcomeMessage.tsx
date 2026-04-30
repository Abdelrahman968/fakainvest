"use client";

import { Bot, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

interface WelcomeMessageProps {
  showSuggestions: boolean;
  suggestions: Array<{ text: string; icon: React.ReactNode }>;
  onSuggestionClick: (text: string) => void;
}

export const WelcomeMessage = ({
  suggestions,
  onSuggestionClick,
}: WelcomeMessageProps) => {
  const t = useTranslations("Chat");

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="glass-card max-w-[90%] rounded-3xl px-6 py-5 text-center">
        <Bot className="h-12 w-12 mx-auto mb-3 text-accent" />
        <p className="text-base font-semibold text-foreground">
          {t("welcome")}
        </p>
        <p className="text-sm text-muted-foreground mt-2">{t("welcomeDesc")}</p>
      </div>

      {suggestions.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <p className="text-xs font-medium text-muted-foreground">
              {t("suggestions")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium transition-all hover:border-accent hover:bg-accent/10 hover:shadow-glow-sm"
              >
                {suggestion.icon}
                <span className="max-w-[200px] truncate">
                  {suggestion.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
