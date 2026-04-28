"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";

const NotFoundClient = () => {
  const location = usePathname();
  const t = useTranslations("NotFound");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location,
    );
  }, [location]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-secondary/20 p-5">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="text-[120px] sm:text-[150px] font-display font-black leading-none">
            <span className="gradient-text">4</span>
            <span className="text-muted-foreground/30">0</span>
            <span className="gradient-text">4</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Search className="h-32 w-32" />
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            {t("pageNotFound")}
          </h2>
          <p className="text-muted-foreground">
            {t("pageNotFoundDescription")}
            <br />
            {t("pageNotFoundDescription2")}
          </p>
          {location !== "/" && (
            <p
              className="text-xs text-muted-foreground/60 font-mono bg-secondary/30 inline-block px-3 py-1 rounded-full mx-auto"
              dir="ltr"
            >
              {location}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full gap-2 border-border hover:bg-secondary cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("goBack")}
          </Button>
          <Link href="/" className="block">
            <Button className="w-full gap-2 bg-gradient-accent shadow-glow hover:opacity-95 cursor-pointer hover:scale-102 transition-all duration-200">
              <Home className="h-4 w-4" />
              {t("returnToHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundClient;
