import { Button } from "@/components/ui/button";

interface PendingCardProps {
  pendingAmount: number;
  pendingCount: number;
  onInvest: () => void;
  buttonText: string;
  description: string;
}

export default function PendingCard({
  pendingAmount,
  pendingCount,
  onInvest,
  buttonText,
  description,
}: PendingCardProps) {
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold">{description}</p>
          <p className="text-xs text-muted-foreground">
            EGP {pendingAmount.toFixed(2)} ({pendingCount} items)
          </p>
        </div>
        <Button
          onClick={onInvest}
          size="sm"
          className="bg-gradient-accent shadow-glow"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
