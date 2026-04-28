import AppProvider from "@/provider/AppProvider";
import { getLocale, getMessages } from "next-intl/server";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <AppProvider locale={locale} messages={messages}>
      {children}
    </AppProvider>
  );
}
