import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { MoreItem as MoreItemType } from "@/types/more";
import { useLocale, useTranslations } from "next-intl";

interface MoreItemProps {
  item: MoreItemType;
}

export default function MoreItem({ item }: MoreItemProps) {
  const t = useTranslations("MorePage");
  const locale = useLocale();

  return (
    <Link
      href={item.to}
      className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 transition-all hover:border-primary-glow/40 hover:bg-secondary"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: `hsl(${item.color} / 0.15)` }}
      >
        <item.icon
          className="h-5 w-5"
          style={{ color: `hsl(${item.color})` }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-display font-semibold">{t(item.labelKey)}</p>
          {item.badge && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
              {t(item.badge)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t(item.descKey)}</p>
      </div>
      <ChevronRight
        className={`h-4 w-4 text-muted-foreground ${locale === "ar" ? "rotate-180" : ""}`}
      />
    </Link>
  );
}
