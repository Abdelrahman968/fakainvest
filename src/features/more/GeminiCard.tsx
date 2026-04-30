import { Link } from "@/i18n/navigation";
import { Sparkles, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function GeminiCard() {
  const t = useTranslations("MorePage");
  const locale = useLocale();

  return (
    <Link
      href="/chat"
      className="flex items-center gap-4 rounded-3xl border border-primary-glow/30 bg-primary-glow/5 p-4 transition-all hover:bg-primary-glow/10"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-display font-semibold">{t("askGemini")}</p>
        <p className="text-xs text-muted-foreground">{t("assistantDesc")}</p>
      </div>
      <ChevronRight
        className={`h-5 w-5 text-muted-foreground ${locale === "ar" ? "rotate-180" : ""}`}
      />
    </Link>
  );
}
