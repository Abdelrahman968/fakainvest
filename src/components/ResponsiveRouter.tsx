"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ResponsiveRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getDeviceType = () => {
      const cookieDevice = document.cookie
        .split("; ")
        .find((row) => row.startsWith("device-type="))
        ?.split("=")[1];

      if (cookieDevice) {
        return cookieDevice === "mobile";
      }

      return window.innerWidth < 768;
    };

    const checkDevice = () => {
      const mobile = getDeviceType();
      setIsMobile(mobile);

      const isOnboardingPath = pathname.includes("/onboarding");
      const isRootPath =
        pathname === "/" || pathname === "/en" || pathname === "/ar";

      if (mobile && !isOnboardingPath && isRootPath) {
        const locale = pathname.split("/")[1];
        const onboardingPath =
          locale && (locale === "en" || locale === "ar")
            ? `/${locale}/onboarding`
            : "/onboarding";
        router.replace(onboardingPath);
      } else if (!mobile && isOnboardingPath) {
        router.replace("/");
      }
    };

    checkDevice();

    const handleResize = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth < 768;

      if (wasMobile !== null && wasMobile !== nowMobile) {
        window.location.reload();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, router, isMobile]);

  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
