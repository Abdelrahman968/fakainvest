"use client";

import { useMemo, useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface SpendingHeatmapProps {
  heatmap: number[][];
}

const days = {
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

const daysShort = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "إثن", "ثلاث", "أربع", "خميس", "جمعة", "سبت"],
};

const hours = ["6a", "9a", "12p", "3p", "6p", "9p"];
const hourRanges = {
  en: ["6-9 AM", "9 AM-12 PM", "12-3 PM", "3-6 PM", "6-9 PM", "9 PM-12 AM"],
  ar: ["٦-٩ ص", "٩ ص-١٢ م", "١٢-٣ م", "٣-٦ م", "٦-٩ م", "٩ م-١٢ ص"],
};

export default function SpendingHeatmap({ heatmap }: SpendingHeatmapProps) {
  const t = useTranslations("Insights");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    const fetchAISuggestion = async () => {
      setLoadingSuggestion(true);
      try {
        const res = await fetch(`/api/insights/ai-suggestion?locale=${locale}`);
        const data = await res.json();
        setAiSuggestion(data.suggestion || t("heatmapSuggestion.default"));
      } catch (error) {
        console.error("Error fetching AI suggestion:", error);
        setAiSuggestion(t("heatmapSuggestion.default"));
      } finally {
        setLoadingSuggestion(false);
      }
    };
    fetchAISuggestion();
  }, [locale, t]);

  const peakSpending = useMemo(() => {
    if (!heatmap || heatmap.length === 0) {
      return {
        day: isArabic ? "الجمعة" : "Friday",
        timeRange: isArabic ? "٦-٩ م" : "6-9 PM",
        maxIntensity: 8,
        dayIndex: isArabic ? 5 : 5,
        hourIndex: 15,
      };
    }

    let maxIntensity = 0;
    let peakDay = 0;
    let peakHour = 0;

    for (let day = 0; day < heatmap.length; day++) {
      for (let hour = 0; hour < heatmap[day].length; hour++) {
        const value = heatmap[day][hour] || 0;
        if (value > maxIntensity) {
          maxIntensity = value;
          peakDay = day;
          peakHour = hour;
        }
      }
    }

    return {
      day: days[locale as "en" | "ar"][peakDay],
      timeRange:
        hourRanges[locale as "en" | "ar"][Math.floor(peakHour / 3)] ||
        (isArabic ? "٦-٩ م" : "6-9 PM"),
      dayIndex: peakDay,
      hourIndex: peakHour,
      maxIntensity,
    };
  }, [heatmap, locale, isArabic]);

  return (
    <section className="glass-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {t("whenYouSpendMost")}
          </p>
          <h3 className="font-display text-lg font-semibold">
            {t("spendingHeatmap")}
          </h3>
        </div>
        <span className="hidden items-center gap-2 text-[10px] text-muted-foreground md:flex">
          {t("less")}
          <span className="flex gap-0.5">
            {[1, 3, 5, 7, 9].map((v) => (
              <span
                key={v}
                className="h-3 w-3 rounded-sm"
                style={{ background: `hsl(199 89% 60% / ${v / 10})` }}
              />
            ))}
          </span>
          {t("more")}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[520px] gap-2">
          <div className="flex flex-col gap-1 pt-5">
            {daysShort[locale as "en" | "ar"].map((d) => (
              <span
                key={d}
                className="h-6 text-[10px] text-muted-foreground leading-6 text-center"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex justify-between px-1 text-[9px] text-muted-foreground">
              {hours.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className="grid grid-rows-7 gap-1">
              {(heatmap || []).map((row, ri) => (
                <div
                  key={ri}
                  className="grid grid-cols-18 gap-1"
                  style={{ gridTemplateColumns: "repeat(18, minmax(0,1fr))" }}
                >
                  {row.map((v, ci) => (
                    <div
                      key={ci}
                      title={`${days[locale as "en" | "ar"][ri]}, ${hourRanges[locale as "en" | "ar"][Math.floor(ci / 3)]} - ${t("intensity")}: ${v || 0}`}
                      className={`h-6 rounded-sm transition-all hover:scale-110 ${
                        ri === peakSpending.dayIndex &&
                        Math.floor(ci / 3) ===
                          Math.floor(peakSpending.hourIndex / 3)
                          ? "ring-2 ring-primary-glow"
                          : ""
                      }`}
                      style={{
                        background:
                          !v || v === 0
                            ? "hsl(220 35% 20% / 0.4)"
                            : `hsl(199 89% 60% / ${0.1 + (v || 0) / 12})`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-primary-glow/10 p-3 text-xs">
        <Sparkles className="h-4 w-4 shrink-0 text-primary-glow" />
        <span className="text-muted-foreground flex-1">
          <span className="font-semibold text-foreground">{t("gemini")}:</span>{" "}
          {loadingSuggestion ? (
            <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
          ) : (
            aiSuggestion || t("heatmapSuggestion.default")
          )}
        </span>
      </div>
    </section>
  );
}
