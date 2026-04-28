export interface Transfer {
  id: string;
  type: "sent" | "received" | "deposit" | "topup" | "card";
  amount: number;
  counterparty: string;
  method: string;
  note?: string;
  avatar?: string;
  created_at: string;
}

export interface Wallet {
  balance: number;
  spent_today: number;
  spent_this_month: number;
  daily_limit: number;
  monthly_limit: number;
  per_transaction_limit: number;
  online_enabled: boolean;
  contactless_enabled: boolean;
  international_enabled: boolean;
  frozen: boolean;
  card_last_four: string;
  card_number?: string;
  card_expiry?: string;
  card_cvv?: string;
  user_id: string;
}

export interface PaymentRequestType {
  _id: string;
  requesterId: string;
  requesterName: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  note: string;
  status: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SearchUser {
  id: string;
  name: string;
  email: string;
}
