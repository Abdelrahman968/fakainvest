interface StatsCardsProps {
  totalRoundUp: number;
  pendingCount: number;
  currency: string;
  totalLabel: string;
  pendingLabel: string;
  itemsLabel: string;
}

export default function StatsCards({
  totalRoundUp,
  pendingCount,
  currency,
  totalLabel,
  pendingLabel,
  itemsLabel,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">{totalLabel}</p>
        <p className="mt-1 font-display text-2xl font-bold gradient-text">
          {currency} {totalRoundUp.toFixed(2)}
        </p>
      </div>
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">{pendingLabel}</p>
        <p className="mt-1 font-display text-2xl font-bold text-warning">
          {pendingCount} {itemsLabel}
        </p>
      </div>
    </div>
  );
}
