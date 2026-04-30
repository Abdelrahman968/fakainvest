export interface Suggestion {
  text: string;
  icon: React.ReactNode;
}

export type ChatContext = {
  name?: string;
  balance: number | null;
  spent_today: number | null;
  spent_this_month: number | null;
  roundUpMode: string;
  pendingRoundUps: number;
  healthScore: number;
  last_5_transfers: Array<{
    type: string;
    amount: number;
    counterparty: string;
  }>;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  created_at: string;
};
