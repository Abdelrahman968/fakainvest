"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { ChatMessage } from "@/types/chat";

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userContext, setUserContext] = useState<any>(null);
  const [messageCount, setMessageCount] = useState(0);

  const fetchUserContext = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUserContext(data.user);
      }
    } catch (error) {
      console.error("Error fetching user context:", error);
    }
  }, []);

  const loadMessages = useCallback(() => {
    if (!user) {
      setMessages([]);
      setMessageCount(0);
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(`chat_messages_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
        const userMsgCount = parsed.filter(
          (m: ChatMessage) => m.role === "user",
        ).length;
        setMessageCount(userMsgCount);
      } else {
        const welcomeMessage: ChatMessage = {
          id: `welcome_${Date.now()}`,
          role: "assistant",
          text: "أهلاً بيك في فكا انفيست! أنا فكا-بوت، مستشارك المالي. اسألني أي حاجة عن الادخار، الاستثمار، أو أهدافك المالية 🚀",
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
        setMessageCount(0);
        localStorage.setItem(
          `chat_messages_${user.id}`,
          JSON.stringify([welcomeMessage]),
        );
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      if (!user) return;
      try {
        localStorage.setItem(
          `chat_messages_${user.id}`,
          JSON.stringify(newMessages),
        );
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    },
    [user],
  );

  const refresh = useCallback(async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }
    await fetchUserContext();
    loadMessages();
  }, [user, fetchUserContext, loadMessages]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const send = async (text: string, context?: Record<string, unknown>) => {
    if (!user || !text.trim()) return;

    const userLevel = userContext?.level || 10;
    let maxMessages = 999;
    if (userLevel === 1) maxMessages = 3;
    else if (userLevel === 2) maxMessages = 6;
    else if (userLevel === 3) maxMessages = 10;
    else if (userLevel === 4) maxMessages = 15;
    else if (userLevel === 5) maxMessages = 20;

    if (messageCount >= maxMessages && maxMessages !== 999) {
      const limitMessage: ChatMessage = {
        id: `limit_${Date.now()}`,
        role: "assistant",
        text: `🔒 **وصلت للحد الأقصى للرسائل!**

مستواك الحالي: المستوى ${userLevel}
عدد الرسائل المستخدمة: ${messageCount}/${maxMessages}

💡 **لرفع المستوى وزيادة عدد الرسائل:**
- استخدم خاصية RoundUp في مشترياتك
- حقق أهدافك الادخارية
- تفاعل أكثر مع التطبيق

كلما زاد مستواك، زاد عدد الرسائل المسموحة!`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      saveMessages([...messages, limitMessage]);
      return;
    }

    setSending(true);

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setMessageCount((prev) => prev + 1);

    try {
      const fullContext = {
        ...userContext,
        ...context,
        level: userContext?.level || 1,
        messagesCount: messageCount + 1,
        messagesLimit: maxMessages,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-15),
          context: fullContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error === "limit_reached") {
        const limitMessage: ChatMessage = {
          id: `limit_${Date.now()}`,
          role: "assistant",
          text: data.text,
          created_at: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, limitMessage];
        setMessages(finalMessages);
        saveMessages(finalMessages);
        setSending(false);
        return;
      }

      const replyText =
        data.text || "عذراً، لم أستطع معالجة طلبك حالياً. حاول تاني بعد شوية.";

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        text: replyText,
        created_at: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: "assistant",
        text: "⚠️ عذراً، في مشكلة في الاتصال. تأكد من اتصالك بالإنترنت وحاول تاني.",
        created_at: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setSending(false);
    }
  };

  const clear = async () => {
    if (!user) return;

    localStorage.removeItem(`chat_messages_${user.id}`);

    const welcomeMessage: ChatMessage = {
      id: `welcome_${Date.now()}`,
      role: "assistant",
      text: "تم مسح المحادثة 🧹\n\nأهلاً بيك تاني في فكا انفيست! أنا فكا-بوت، جاهز أساعدك في رحلتك المالية. اسألني أي حاجة 🚀",
      created_at: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    setMessageCount(0);
    saveMessages([welcomeMessage]);
  };

  return {
    messages,
    loading,
    sending,
    refresh,
    send,
    clear,
    userContext,
    messageCount,
  };
};
