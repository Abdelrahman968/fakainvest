import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IWallet extends Document {
  userId: Types.ObjectId;
  // Balance
  balance: number;
  // Card spend tracking
  spentToday: number;
  spentThisMonth: number;
  spentTodayDate: string;   // "YYYY-MM-DD" rollover key
  spentMonthKey: string;    // "YYYY-MM" rollover key
  // Card controls
  frozen: boolean;
  dailyLimit: number;
  monthlyLimit: number;
  perTransactionLimit: number;
  onlineEnabled: boolean;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  atmEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId:               { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance:              { type: Number, default: 0, min: 0 },
    spentToday:           { type: Number, default: 0 },
    spentThisMonth:       { type: Number, default: 0 },
    spentTodayDate:       { type: String, default: () => new Date().toISOString().slice(0, 10) },
    spentMonthKey:        { type: String, default: () => new Date().toISOString().slice(0, 7) },
    frozen:               { type: Boolean, default: false },
    dailyLimit:           { type: Number, default: 3000 },
    monthlyLimit:         { type: Number, default: 10000 },
    perTransactionLimit:  { type: Number, default: 1500 },
    onlineEnabled:        { type: Boolean, default: true },
    contactlessEnabled:   { type: Boolean, default: true },
    internationalEnabled: { type: Boolean, default: false },
    atmEnabled:           { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Wallet: Model<IWallet> =
  (models.Wallet as Model<IWallet>) ?? model<IWallet>("Wallet", walletSchema);
