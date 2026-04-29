export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  roundUp: number;
  date: string;
  status: "Pending" | "Completed" | "Failed";
}
