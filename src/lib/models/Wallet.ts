import { Schema, model, models, Model } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  balance: number;
  pendingRoundUps: number;
  frozen: boolean;
  dailyLimit: number;
  monthlyLimit: number;
  perTransactionLimit: number;
  spentToday: number;
  spentTodayDate: string;
  spentThisMonth: number;
  spentMonthKey: string;
  onlineEnabled: boolean;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  atmEnabled: boolean;
  card_last_four?: string;
  card_number?: string;
  card_expiry?: string;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    pendingRoundUps: { type: Number, default: 0, min: 0 },
    frozen: { type: Boolean, default: false },
    dailyLimit: { type: Number, default: 3000 },
    monthlyLimit: { type: Number, default: 10000 },
    perTransactionLimit: { type: Number, default: 1500 },
    spentToday: { type: Number, default: 0 },
    spentTodayDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    spentThisMonth: { type: Number, default: 0 },
    spentMonthKey: {
      type: String,
      default: () => new Date().toISOString().slice(0, 7),
    },
    onlineEnabled: { type: Boolean, default: true },
    contactlessEnabled: { type: Boolean, default: true },
    internationalEnabled: { type: Boolean, default: false },
    atmEnabled: { type: Boolean, default: true },
    card_last_four: { type: String, default: "9847" },
    card_number: { type: String, default: "5412 7823 1290 9847" },
    card_expiry: { type: String, default: "08/28" },
  },
  { timestamps: true },
);

export const Wallet: Model<IWallet> =
  models.Wallet ?? model<IWallet>("Wallet", walletSchema);
