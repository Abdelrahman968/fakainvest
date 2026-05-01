import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

const staticRoutes = [
  "",
  "/auth",
  "/onboarding",
  "/dashboard",
  "/activity",
  "/budget",
  "/chat",
  "/contacts",
  "/family",
  "/goals",
  "/insights",
  "/market",
  "/more",
  "/portfolio",
  "/profile",
  "/real-estate",
  "/referral",
  "/report",
  "/rewards",
  "/rules",
  "/transactions",
  "/wallet",
];

const locales = ["en", "ar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      routes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: now,
      });
    }
  }

  return routes;
}
