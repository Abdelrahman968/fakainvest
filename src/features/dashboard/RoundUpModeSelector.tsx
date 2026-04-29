"use client";

import { cn } from "@/lib/utils";
import { XCircle, Leaf, Rocket, Coins, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export type RoundUpMode = "None" | "Eco" | "Boost" | "Fixed20" | "Custom";

const migrateOldMode = (oldMode: string): RoundUpMode => {
  const modeMap: Record<string, RoundUpMode> = {
    None: "None",
    Eco: "Eco",
    Boost: "Boost",
    Fixed20: "Fixed20",
    Custom: "Custom",
    Normal: "Eco",
    Medium: "Boost",
    Aggressive: "Fixed20",
  };

  const result = modeMap[oldMode];
  if (!result) {
    console.warn(`Unknown mode: "${oldMode}", defaulting to Eco`);
    return "Eco";
  }
  return result;
};

const modeConfig = {
  None: {
    labelKey: "None",
    descriptionKey: "roundUpDisabled",
    icon: <XCircle size={20} className="text-gray-400" />,
  },
  Eco: {
    labelKey: "Eco",
    descriptionKey: "roundUpEco",
    icon: <Leaf size={20} className="text-green-500" />,
  },
  Boost: {
    labelKey: "Boost",
    descriptionKey: "roundUpBoost",
    icon: <Rocket size={20} className="text-blue-500" />,
  },
  Fixed20: {
    labelKey: "Fixed20",
    descriptionKey: "roundUpFixed20",
    icon: <Coins size={20} className="text-purple-500" />,
  },
  Custom: {
    labelKey: "Custom",
    descriptionKey: "roundUpCustom",
    icon: <Sliders size={20} className="text-orange-500" />,
  },
};

interface RoundUpModeSelectorProps {
  mode: RoundUpMode | string;
  customAmount?: number;
  enabled?: boolean;
  onModeChange: (mode: RoundUpMode, customAmount?: number) => void;
  onEnabledChange?: (enabled: boolean) => void;
  pendingAmount?: number;
}

export default function RoundUpModeSelector({
  mode: initialMode,
  customAmount = 10,
  enabled = true,
  onModeChange,
  onEnabledChange,
  pendingAmount = 0,
}: RoundUpModeSelectorProps) {
  const t = useTranslations("WalletPageVisa.DashboardPage");
  const tWallet = useTranslations("WalletPageVisa");

  const currentMode = migrateOldMode(String(initialMode));
  const [tempCustomAmount, setTempCustomAmount] = useState(customAmount);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    setTempCustomAmount(customAmount);
  }, [customAmount]);

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  const handleModeSelect = (newMode: RoundUpMode) => {
    if (newMode === "Custom") {
      setCustomDialogOpen(true);
    } else {
      onModeChange(newMode);
      toast({
        title: `${t("roundUpMode")}: ${t(modeConfig[newMode].labelKey)}`,
        description: tWallet(modeConfig[newMode].descriptionKey),
      });
    }
  };

  const handleEnabledToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (!checked) {
      onModeChange("None");
      toast({
        title: tWallet("roundUpDisabled"),
        description: tWallet("roundUpTurnedOff"),
      });
    } else {
      onModeChange(currentMode);
      toast({
        title: tWallet("roundUpEnabled"),
        description: tWallet("roundUpTurnedOn"),
      });
    }
    onEnabledChange?.(checked);
  };

  const handleCustomSave = () => {
    if (tempCustomAmount < 5) {
      toast({
        title: tWallet("invalidAmount"),
        description: tWallet("minCustomAmount"),
        variant: "destructive",
      });
      return;
    }
    if (tempCustomAmount > 100) {
      toast({
        title: tWallet("invalidAmount"),
        description: tWallet("maxCustomAmount"),
        variant: "destructive",
      });
      return;
    }
    onModeChange("Custom", tempCustomAmount);
    setCustomDialogOpen(false);
    toast({
      title: tWallet("customModeActivated"),
      description: tWallet("addingAmount", { amount: tempCustomAmount }),
    });
  };

  const displayMode = isEnabled ? currentMode : "None";
  const currentConfig = modeConfig[displayMode] || modeConfig.Eco;
  const currentDescription = tWallet(currentConfig.descriptionKey);

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-display font-semibold">{t("roundUpMode")}</p>
            <Switch checked={isEnabled} onCheckedChange={handleEnabledToggle} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isEnabled
              ? `${currentDescription}${displayMode === "Custom" ? ` (${customAmount} ${tWallet("egp")})` : ""}`
              : tWallet("roundUpDisabled")}
          </p>
        </div>
        {pendingAmount > 0 && isEnabled && displayMode !== "None" && (
          <span className="rounded-full bg-gradient-accent px-3 py-1 font-display text-sm font-bold text-primary-foreground animate-pulse">
            {tWallet("activeRoundUps")}
          </span>
        )}
      </div>

      {isEnabled ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(modeConfig) as RoundUpMode[])
            .filter((mode) => mode !== "None")
            .map((mode) => {
              const isActive = currentMode === mode;

              return (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-1",
                    isActive
                      ? "bg-gradient-accent text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {modeConfig[mode].icon}
                  <span className="text-xs hidden md:block">
                    {t(modeConfig[mode].labelKey)}
                  </span>
                </button>
              );
            })}
        </div>
      ) : (
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {tWallet("roundUpTurnedOff")}
          </p>
        </div>
      )}

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tWallet("customRoundUpAmount")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customAmount">
                {tWallet("amountPerTransaction")} ({tWallet("egp")})
              </Label>
              <Input
                id="customAmount"
                type="number"
                min="5"
                max="100"
                step="5"
                value={tempCustomAmount}
                onChange={(e) => setTempCustomAmount(Number(e.target.value))}
                className="text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground">
                {tWallet("minMaxCustomAmount")}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-sm font-medium mb-2">
                📊 {tWallet("monthlyImpact")}:
              </p>
              <p className="text-2xl font-bold text-primary">
                {tWallet("egp")} {tempCustomAmount * 30}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tWallet("monthlyImpactDescription")}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCustomDialogOpen(false)}
                className="flex-1"
              >
                {tWallet("cancel")}
              </Button>
              <Button onClick={handleCustomSave} className="flex-1">
                {tWallet("applyCustomAmount")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
