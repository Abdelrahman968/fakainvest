import { useTranslations } from "next-intl";
import GeminiCard from "@/features/more/GeminiCard";
import MoreList from "@/features/more/MoreList";

export default function MorePage() {
  const t = useTranslations("MorePage");

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">{t("head")}</p>
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      </header>

      <GeminiCard />
      <MoreList />
    </div>
  );
}
