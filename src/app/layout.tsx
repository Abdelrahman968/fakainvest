import type { Metadata } from "next";
import { Cairo, Exo, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getLocale } from "next-intl/server";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      "https://fakainviest.vercel.app/" ||
      "localhost:3000",
  ),
  title: "Faka Inviest",
  description:
    "Invest your spare change automatically, save for your goals, and grow your wealth effortlessly with Faka Inviest.",
  openGraph: {
    images: "/og.png",
  },
  verification: {
    google: process.env.GOOGLE_MASTER_WEB || "",
    other: {
      "msvalidate.01": process.env.BING_MASTER_WEB || "",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "h-full",
        "antialiased",
        cairo.variable,
        exo.variable,
        sora.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
