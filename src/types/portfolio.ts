export type Range = "1m" | "6m" | "12m";

export interface PortfolioStats {
  total: number;
  return: number;
  holdingsCount: number;
}
