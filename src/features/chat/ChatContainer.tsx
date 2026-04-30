"use client";

import { useRef, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useChat } from "@/hooks/useChat";
import { useWallet } from "@/hooks/useWallet";
import { useProfile } from "@/hooks/useProfile";
import { ChatHeader } from "./ChatHeader";
import { WelcomeMessage } from "./WelcomeMessage";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatSuggestions } from "@/hooks/useChatSuggestions";
import { ChatContext } from "@/types/chat";

export const ChatContainer = () => {
  const { messages, loading, sending, send, clear, userContext } = useChat();
  const { wallet, transfers } = useWallet();
  const { profile } = useProfile();
  const locale = useLocale();

  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isArabic = locale === "ar";

  const context: ChatContext = {
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

  const suggestions = useChatSuggestions(locale, context);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (messages.length > 0 && showSuggestions) {
      setShowSuggestions(false);
    }
  }, [messages.length, showSuggestions]);

  const handleSend = (text: string) => {
    if (!text.trim() || sending) return;
    setInput("");
    setShowSuggestions(false);
    send(text, context);
  };

  const handleClear = () => {
    clear();
    setShowSuggestions(true);
  };

  const hasMessages = messages.length > 1;

  return (
    <div className="flex h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex-col rounded-3xl bg-linear-to-b from-background/95 to-background/80 backdrop-blur-sm font-cairo">
      <ChatHeader messagesCount={messages.length} onClear={handleClear} />

      {loading && <div className="flex-1" />}

      {!loading && !hasMessages && (
        <WelcomeMessage
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          onSuggestionClick={handleSend}
        />
      )}

      {hasMessages && (
        <MessageList
          messages={messages}
          sending={sending}
          isArabic={isArabic}
        />
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => handleSend(input)}
        sending={sending}
        isArabic={isArabic}
        inputRef={inputRef}
      />

      <div ref={endRef} />
    </div>
  );
};
