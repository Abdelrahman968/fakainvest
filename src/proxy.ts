import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

const TOKEN_COOKIE = "faka_token";

const PUBLIC_PATHS = ["/onboarding", "/auth"];
const ROOT_PATH = "/";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAuthenticated = !!authToken;

  const parser = new UAParser(request.headers.get("user-agent") || "");
  const result = parser.getResult();
  const isMobile =
    result.device.type === "mobile" || result.device.type === "tablet";
  const isTablet = result.device.type === "tablet";

  const response = NextResponse.next();
  response.headers.set("x-device-type", isMobile ? "mobile" : "desktop");
  response.headers.set("x-is-tablet", isTablet ? "true" : "false");

  const nextIntlResponse = createMiddleware(routing)(request);
  const finalResponse = nextIntlResponse || response;

  finalResponse.cookies.set("device-type", isMobile ? "mobile" : "desktop", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "lax",
  });

  const hasSeenOnboarding =
    request.cookies.get("onboarding-completed")?.value === "true";

  const pathSegments = pathname.split("/").filter(Boolean);
  const validLocales = ["en", "ar"] as const;
  type ValidLocale = (typeof validLocales)[number];

  const locale = validLocales.includes(pathSegments[0] as ValidLocale)
    ? (pathSegments[0] as ValidLocale)
    : null;
  const route = locale ? pathSegments[1] : pathSegments[0];

  const pathWithoutLocale = locale
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;

  if (route === "complete-onboarding") {
    const redirectResponse = NextResponse.redirect(
      new URL(locale ? `/${locale}/dashboard` : "/dashboard", request.url),
    );
    redirectResponse.cookies.set("onboarding-completed", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return redirectResponse;
  }

  if (isAuthenticated && (route === "auth" || pathWithoutLocale === "/auth")) {
    const redirectPath = locale ? `/${locale}/dashboard` : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  const isPublicPath =
    pathWithoutLocale === ROOT_PATH ||
    PUBLIC_PATHS.some(
      (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`),
    );

  if (!isAuthenticated && !isPublicPath) {
    const callbackUrl = encodeURIComponent(pathname);
    const loginPath = locale ? `/${locale}/auth` : "/auth";
    const redirectUrl = `${loginPath}?callbackUrl=${callbackUrl}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const isRootPath = !locale ? pathname === "/" : pathname === `/${locale}`;

  if (isRootPath) {
    if (isAuthenticated) {
      const dashboardPath = locale ? `/${locale}/dashboard` : "/dashboard";
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    if (!hasSeenOnboarding && isMobile && !isAuthenticated) {
      const onboardingPath = locale ? `/${locale}/onboarding` : "/onboarding";
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }
    return finalResponse;
  }

  if (route === "onboarding") {
    if (isAuthenticated) {
      const homePath = locale ? `/${locale}/dashboard` : "/dashboard";
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    if (hasSeenOnboarding) {
      const homePath = locale ? `/${locale}/dashboard` : "/dashboard";
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    if (!isMobile) {
      const homePath = locale ? `/${locale}` : "/";
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    return finalResponse;
  }

  if (route === "desktop") {
    const returnUrl = locale ? `/${locale}` : "/";
    const desktopResponse = NextResponse.redirect(
      new URL(returnUrl, request.url),
    );
    desktopResponse.cookies.set("force-desktop", "true", {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return desktopResponse;
  }

  return finalResponse;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
