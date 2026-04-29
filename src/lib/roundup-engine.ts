export type RoundUpMode = "None" | "Eco" | "Boost" | "Fixed20" | "Custom";

interface RoundUpResult {
  originalAmount: number;
  roundedAmount: number;
  roundUpAmount: number;
  finalAmount: number;
  mode: RoundUpMode;
}

export function calculateRoundUp(
  amount: number,
  mode: RoundUpMode,
  customAmount?: number,
): RoundUpResult {
  if (mode === "None") {
    return {
      originalAmount: amount,
      roundedAmount: amount,
      roundUpAmount: 0,
      finalAmount: amount,
      mode: "None",
    };
  }

  let roundUpAmount = 0;
  let roundedAmount = amount;

  switch (mode) {
    case "Eco":
      roundedAmount = Math.ceil(amount / 5) * 5;
      roundUpAmount = roundedAmount - amount;
      break;

    case "Boost":
      roundedAmount = Math.ceil(amount / 10) * 10;
      roundUpAmount = roundedAmount - amount;
      break;

    case "Fixed20":
      roundUpAmount = 20;
      roundedAmount = amount + 20;
      break;

    case "Custom":
      const fixedAmount = customAmount || 10;
      roundUpAmount = fixedAmount;
      roundedAmount = amount + fixedAmount;
      break;
  }

  return {
    originalAmount: amount,
    roundedAmount,
    roundUpAmount,
    finalAmount: roundedAmount,
    mode,
  };
}

export function getRoundUpDescription(
  mode: RoundUpMode,
  customAmount?: number,
): string {
  switch (mode) {
    case "None":
      return "RoundUp is disabled";
    case "Eco":
      return "Round up to nearest 5 EGP";
    case "Boost":
      return "Round up to nearest 10 EGP";
    case "Fixed20":
      return "Add fixed 20 EGP per transaction";
    case "Custom":
      return `Add fixed ${customAmount || 10} EGP per transaction`;
    default:
      return "Unknown mode";
  }
}

export function calculateTotalPendingRoundUps(
  transactions: Array<{ roundUp: number; isRoundUpProcessed?: boolean }>,
): number {
  return transactions
    .filter((tx) => tx.roundUp > 0 && !tx.isRoundUpProcessed)
    .reduce((sum, tx) => sum + tx.roundUp, 0);
}

export function shouldProcessRoundUps(
  pendingAmount: number,
  threshold: number = 20,
  mode: RoundUpMode = "Eco",
): boolean {
  if (pendingAmount <= 0) return false;

  if ((mode === "Fixed20" || mode === "Custom") && pendingAmount >= threshold)
    return true;

  return pendingAmount >= threshold;
}

export function calculateExpectedMonthlySavings(
  mode: RoundUpMode,
  avgTransactionAmount: number = 50,
  monthlyTransactions: number = 30,
  customAmount?: number,
): number {
  if (mode === "None") return 0;

  let avgRoundUp = 0;
  switch (mode) {
    case "Eco":
      avgRoundUp = 2.5;
      break;
    case "Boost":
      avgRoundUp = 5;
      break;
    case "Fixed20":
      avgRoundUp = 20;
      break;
    case "Custom":
      avgRoundUp = customAmount || 10;
      break;
  }

  return avgRoundUp * monthlyTransactions;
}
