"use client";

import { useRef, useEffect, useState } from "react";
import {
  Send,
  Loader2,
  Trash2,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  PiggyBank,
  Shield,
  ChartLine,
  Wallet,
  Target,
  Gem,
  Activity,
} from "lucide-react";

import { useChat } from "@/hooks/useChat";
import { useWallet } from "@/hooks/useWallet";
import { useProfile } from "@/hooks/useProfile";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const getSuggestionsByContext = (lang: string, context: any) => {
  const isAr = lang === "ar";

  const suggestions = [];

  suggestions.push({
    text: isAr ? "حلل مصاريف الشهر" : "Analyze my monthly spending",
    icon: <ChartLine className="h-3.5 w-3.5" />,
  });
  suggestions.push({
    text: isAr ? "أستثمر في دهب ولا ايه؟" : "Should I invest in gold?",
    icon: <Gem className="h-3.5 w-3.5" />,
  });
  suggestions.push({
    text: isAr ? "شرح درجة الصحة المالية" : "Explain Financial Health Score",
    icon: <Activity className="h-3.5 w-3.5" />,
  });

  if (context?.pendingRoundUps > 0) {
    suggestions.push({
      text: isAr
        ? `عندي ${context.pendingRoundUps} جنيه معلقة من التقريب، اعمل بيهم ايه؟`
        : `I have ${context.pendingRoundUps} EGP in pending RoundUps, what should I do?`,
      icon: <PiggyBank className="h-3.5 w-3.5" />,
    });
  }

  if (context?.balance > 0) {
    suggestions.push({
      text: isAr
        ? `ازاي أستثمر ${Math.floor(context.balance * 0.2)} جنيه من رصيدي؟`
        : `How to invest ${Math.floor(context.balance * 0.2)} EGP from my balance?`,
      icon: <TrendingUp className="h-3.5 w-3.5" />,
    });
  }

  if (context?.healthScore < 70 && context?.healthScore > 0) {
    suggestions.push({
      text: isAr
        ? "ازاي أحسن درجة الصحة المالية بتاعتي؟"
        : "How to improve my Financial Health Score?",
      icon: <Activity className="h-3.5 w-3.5" />,
    });
  }

  suggestions.push({
    text: isAr
      ? "ازاي أوصل لـ 10,000 جنيه خلال 6 شهور؟"
      : "How to save 10,000 EGP in 6 months?",
    icon: <Target className="h-3.5 w-3.5" />,
  });
  suggestions.push({
    text: isAr
      ? "نصايح لتوفير الفكة يومياً"
      : "Daily saving tips for spare change",
    icon: <PiggyBank className="h-3.5 w-3.5" />,
  });
  suggestions.push({
    text: isAr
      ? "الفرق بين الصكوك والأسهم"
      : "Difference between Sukuk and stocks",
    icon: <Shield className="h-3.5 w-3.5" />,
  });
  suggestions.push({
    text: isAr ? "ازاي أزود نقاط التوفير؟" : "How to earn more saving points?",
    icon: <Wallet className="h-3.5 w-3.5" />,
  });

  return suggestions.slice(0, 6);
};

const Chat = () => {
  const { messages, loading, sending, send, clear, userContext } = useChat();
  const { wallet, transfers } = useWallet();
  const { profile } = useProfile();
  const locale = useLocale();
  const t = useTranslations("Chat");

  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAr = locale === "ar";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (messages.length > 0 && showSuggestions) {
      setShowSuggestions(false);
    }
  }, [messages.length, showSuggestions]);

  const ctx = {
    name: profile?.display_name,
    balance: wallet ? Number(wallet.balance) : null,
    spent_today: wallet ? Number(wallet.spent_today) : null,
    spent_this_month: wallet ? Number(wallet.spent_this_month) : null,
    roundUpMode: userContext?.roundUpMode || "Eco",
    pendingRoundUps: userContext?.pendingRoundUps || 0,
    healthScore: userContext?.healthScore || 0,
    last_5_transfers: transfers.slice(0, 5).map((t) => ({
      type: t.type,
      amount: Number(t.amount),
      counterparty: t.counterparty,
    })),
  };

  const handleSend = (text: string) => {
    if (!text.trim() || sending) return;
    setInput("");
    setShowSuggestions(false);
    send(text, ctx);
  };

  const handleClear = () => {
    clear();
    setShowSuggestions(true);
  };

  const suggestions = getSuggestionsByContext(locale, ctx);

  return (
    <div className="flex h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex-col rounded-3xl bg-linear-to-b from-background/95 to-background/80 backdrop-blur-sm font-cairo">
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
              {isAr
                ? "متصل · مستشارك المالي"
                : "Online · Your AI Financial Advisor"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
              aria-label="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2 scroll-smooth">
        {loading && (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        )}

        {!loading && (messages.length == 1 || messages.length == 0) && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="glass-card max-w-[90%] rounded-3xl px-6 py-5 text-center">
              <Bot className="h-12 w-12 mx-auto mb-3 text-accent" />
              <p className="text-base font-semibold text-foreground">
                {isAr
                  ? "👋 أهلاً بيك في فكا انفيست!"
                  : "👋 Welcome to FakaInvest!"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {isAr
                  ? "أنا فكا-بوت، مستشارك المالي الذكي. أقدر أشوف رصيدك، معاملاتك، وأهدافك وأساعدك تحقق أهدافك المالية الحلال 🚀"
                  : "I'm FakaBot, your smart financial advisor. I can see your balance, transactions, and goals to help you achieve your halal financial goals 🚀"}
              </p>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="w-full max-w-md mt-4">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <p className="text-xs font-medium text-muted-foreground">
                    {isAr ? "اقتراحات لتبدأ بها" : "Suggestions to get started"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion.text)}
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
        )}

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
                  isAr ? "ar-EG" : "en-GB",
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
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="mt-2 flex items-center gap-2 rounded-2xl border border-border/50 bg-card/80 p-2 backdrop-blur-md"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isAr ? "اكتب سؤالك هنا..." : "Ask anything about your money..."
          }
          dir={isAr ? "rtl" : "ltr"}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary-glow to-accent text-primary-foreground shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg disabled:opacity-40 disabled:hover:scale-100"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
export default Chat;
