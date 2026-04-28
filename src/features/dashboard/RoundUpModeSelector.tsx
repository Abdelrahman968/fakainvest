"use client";

import { cn } from "@/lib/utils";
import { Flame, Gauge, XCircle, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const modeConfig = {
  None: {
    mult: "0×",
    desc: "Off",
    icon: <XCircle size={20} className="text-gray-400" />,
  },
  Normal: {
    mult: "10×",
    desc: "Round10",
    icon: <Zap size={20} className="text-yellow-500" />,
  },
  Medium: {
    mult: "20×",
    desc: "Round20",
    icon: <Gauge size={20} className="text-orange-500" />,
  },
  Aggressive: {
    mult: "50×",
    desc: "Round50",
    icon: <Flame size={20} className="text-red-500" />,
  },
};

type Mode = keyof typeof modeConfig;

interface RoundUpModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function RoundUpModeSelector({
  mode,
  onModeChange,
}: RoundUpModeSelectorProps) {
  const t = useTranslations("DashboardPage");

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold">{t("roundUpMode")}</p>
          <p className="text-xs text-muted-foreground">
            {t(modeConfig[mode].desc)}
          </p>
        </div>
        <span className="rounded-full bg-gradient-accent px-3 py-1 font-display text-sm font-bold text-primary-foreground">
          {modeConfig[mode].mult}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(modeConfig) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer flex justify-center items-center",
              mode === m
                ? "bg-gradient-accent text-primary-foreground shadow-glow"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="hidden md:block">{t(m)}</span>
            <span className="md:hidden mx-auto">{modeConfig[m].icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
