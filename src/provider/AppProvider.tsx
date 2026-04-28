"use client";
import React from "react";
import HtmlDirectionSync from "@/components/HtmlDirectionSync";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import ResponsiveRouter from "@/components/ResponsiveRouter";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

function AppProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ResponsiveRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <HtmlDirectionSync />
          <ProgressBarProvider>{children}</ProgressBarProvider>
          <BottomNav />
        </AuthProvider>
      </ResponsiveRouter>
    </NextIntlClientProvider>
  );
}

export default AppProvider;
