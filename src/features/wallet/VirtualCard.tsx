"use client";

import {
  Wifi,
  Snowflake,
  Settings,
  XCircle,
  Leaf,
  Rocket,
  Coins,
  Sliders,
  CircleDollarSign,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, JSX } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type RoundUpMode = "None" | "Eco" | "Boost" | "Fixed20" | "Custom";

const migrateOldMode = (oldMode: string): RoundUpMode => {
  if (oldMode === "None") return "None";
  if (oldMode === "Eco") return "Eco";
  if (oldMode === "Boost") return "Boost";
  if (oldMode === "Fixed20") return "Fixed20";
  if (oldMode === "Custom") return "Custom";

  switch (oldMode) {
    case "Normal":
      return "Eco";
    case "Medium":
      return "Boost";
    case "Aggressive":
      return "Fixed20";
    default:
      return "Eco";
  }
};

const modeConfig: Record<
  RoundUpMode,
  {
    icon: JSX.Element;
    labelKey: string;
    color: string;
  }
> = {
  None: {
    icon: <XCircle size={18} />,
    labelKey: "None",
    color: "text-gray-400",
  },
  Eco: {
    icon: <Leaf size={18} />,
    labelKey: "Eco",
    color: "text-green-500",
  },
  Boost: {
    icon: <Rocket size={18} />,
    labelKey: "Boost",
    color: "text-blue-500",
  },
  Fixed20: {
    icon: <Coins size={18} />,
    labelKey: "Fixed20",
    color: "text-purple-500",
  },
  Custom: {
    icon: <Sliders size={18} />,
    labelKey: "Custom",
    color: "text-orange-500",
  },
};

interface VirtualCardProps {
  cardNumber: string;
  cardFull: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv?: string;
  frozen: boolean;
  showDetails: boolean;
  roundUpEnabled?: boolean;
  roundUpMode?: RoundUpMode | string;
  onRoundUpSettingsChange?: (enabled: boolean, mode: RoundUpMode) => void;
}

export default function VirtualCard({
  cardNumber,
  cardFull,
  cardHolder,
  cardExpiry,
  cardCvv,
  frozen,
  showDetails,
  roundUpEnabled = true,
  roundUpMode = "Eco",
  onRoundUpSettingsChange,
}: VirtualCardProps) {
  const t = useTranslations("WalletPageVisa");

  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState(roundUpEnabled);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentMode = migrateOldMode(String(roundUpMode));
  const currentModeConfig = modeConfig[currentMode] || modeConfig.Eco;

  useEffect(() => {
    setIsRoundUpEnabled(roundUpEnabled);
  }, [roundUpEnabled]);

  const handleEnableChange = (enabled: boolean) => {
    setIsRoundUpEnabled(enabled);
    onRoundUpSettingsChange?.(enabled, currentMode);
  };

  const handleModeChange = (newMode: RoundUpMode) => {
    onRoundUpSettingsChange?.(isRoundUpEnabled, newMode);
  };

  const getButtonText = () => {
    if (isRoundUpEnabled && currentMode !== "None") {
      return `${t("roundUpMode")}: ${t(`DashboardPage.${currentModeConfig.labelKey}`)}`;
    }
    return t("roundUpOff");
  };

  return (
    <>
      <div
        className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-3xl p-5 shadow-elegant transition-all ${
          frozen ? "opacity-60 grayscale" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, hsl(220 60% 18%) 0%, hsl(199 89% 35%) 50%, hsl(45 90% 50%) 130%)",
        }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-glow/25 blur-3xl" />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-black/60 transition-all">
              <CircleDollarSign className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{getButtonText()}</span>
              <span className="sm:hidden">
                <Settings className="h-3 w-3" />
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md px-5">
            <DialogHeader>
              <DialogTitle className="text-center">
                {t("roundUpSettings")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-4">
                <div>
                  <p className="font-semibold">{t("enableRoundUp")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("roundUpDescription")}
                  </p>
                </div>
                <Switch
                  checked={isRoundUpEnabled}
                  onCheckedChange={handleEnableChange}
                />
              </div>

              {isRoundUpEnabled && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    {t("selectRoundUpMode")}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(
                      ["Eco", "Boost", "Fixed20", "Custom"] as RoundUpMode[]
                    ).map((mode) => {
                      const config = modeConfig[mode];
                      const isSelected = currentMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => handleModeChange(mode)}
                          className={cn(
                            "rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                            isSelected
                              ? "bg-gradient-accent text-primary-foreground shadow-glow"
                              : "bg-secondary text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={config.color}>{config.icon}</div>
                            <span className="text-xs hidden md:block">
                              {t(`DashboardPage.${config.labelKey}`)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                    <p>• {t("roundUpEco")}</p>
                    <p>• {t("roundUpBoost")}</p>
                    <p>• {t("roundUpFixed20")}</p>
                    <p>• {t("roundUpCustom")}</p>
                  </div>
                </div>
              )}

              {!isRoundUpEnabled && (
                <div className="rounded-lg bg-secondary p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("roundUpDisabledMessage")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {t("enableToStartSaving")}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="relative flex h-full flex-col justify-between text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-base font-bold">FakaInvest</p>
              <p className="text-[10px] uppercase tracking-wide opacity-60">
                {t("virtual")}
              </p>
            </div>
            <Wifi className="h-5 w-5 rotate-90 opacity-70" />
          </div>
          <div className="h-6 w-9 rounded-[4px] bg-linear-to-br from-yellow-200 to-yellow-500 opacity-90" />
          <div>
            <p className="font-mono text-base font-semibold tracking-widest md:text-lg">
              {showDetails ? cardFull : cardNumber}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase opacity-60">
                  {t("cardHolder")}
                </p>
                <p className="text-xs font-semibold">{cardHolder}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase opacity-60">
                  {t("expires")}
                </p>
                <p className="text-xs font-semibold">{cardExpiry}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase opacity-60">CVV</p>
                <p className="text-xs font-semibold">
                  {showDetails ? cardCvv || "428" : "•••"}
                </p>
              </div>
              <span className="font-display text-sm italic font-bold">
                mastercard
              </span>
            </div>
          </div>
        </div>
        {frozen && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-3xl">
            <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-semibold">
              <Snowflake className="h-4 w-4 text-primary-glow" />
              {t("cardFrozen")}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
