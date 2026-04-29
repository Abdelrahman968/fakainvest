// src/features/dashboard/RoundUpSummary.tsx
"use client";

import { useState, useEffect } from "react";
import { Target, TrendingUp, RefreshCw, Zap, Gauge, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface RoundUpSummaryProps {
  userId: string;
  className?: string;
}

interface RoundUpStatus {
  pendingAmount: number;
  threshold: number;
  roundUpMode: string;
  canProcess: boolean;
  walletPendingBalance: number;
  transactionCount: number;
}

const modeIcons = {
  Normal: <Zap className="h-4 w-4 text-yellow-500" />,
  Medium: <Gauge className="h-4 w-4 text-orange-500" />,
  Aggressive: <Flame className="h-4 w-4 text-red-500" />,
};

export default function RoundUpSummary({
  userId,
  className,
}: RoundUpSummaryProps) {
  const [status, setStatus] = useState<RoundUpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/roundup/process");
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch RoundUp status:", error);
    } finally {
      setLoading(false);
    }
  };

  const processRoundUps = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/roundup/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "✨ RoundUp Invested!",
          description: data.message,
        });
        await fetchStatus();
      } else {
        toast({
          title: "Unable to process",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process RoundUps",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  if (loading) {
    return (
      <div className={cn("glass-card p-5 animate-pulse", className)}>
        <div className="h-20 rounded bg-muted" />
      </div>
    );
  }

  if (!status || status.pendingAmount === 0) {
    return null;
  }

  const progress = Math.min(
    (status.pendingAmount / status.threshold) * 100,
    100,
  );
  const modeIcon = modeIcons[status.roundUpMode as keyof typeof modeIcons] || (
    <Target className="h-4 w-4" />
  );

  return (
    <div
      className={cn(
        "glass-card p-5 bg-linear-to-r from-primary/5 to-accent/5",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/20 p-2">{modeIcon}</div>
          <div>
            <p className="font-display font-semibold text-sm">
              RoundUp Savings
            </p>
            <p className="text-xs text-muted-foreground">
              {status.transactionCount} pending transaction
              {status.transactionCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={processRoundUps}
          disabled={processing || !status.canProcess}
          className="gap-2"
        >
          {processing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          {status.canProcess
            ? "Invest Now"
            : `Need EGP ${(status.threshold - status.pendingAmount).toFixed(2)} more`}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-bold text-primary">
            EGP {status.pendingAmount.toFixed(2)}
          </span>
          <span className="text-muted-foreground">
            Target: EGP {status.threshold}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-center mt-2">
          {status.canProcess
            ? "🎉 Ready to invest! Click above to add to your portfolio."
            : `💰 Keep shopping! Save EGP ${(status.threshold - status.pendingAmount).toFixed(2)} more to invest.`}
        </p>
      </div>
    </div>
  );
}
