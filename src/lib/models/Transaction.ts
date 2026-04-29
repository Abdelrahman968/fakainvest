import { Schema, model, models, Document, Model } from "mongoose";

export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface ITransaction extends Document {
  id: string;
  userId: string;
  merchant: string;
  category: string;
  amount: number;
  roundUp: number;
  originalAmount?: number;
  isRoundUpProcessed?: boolean;
  date: string;
  status: TransactionStatus;
}

const transactionSchema = new Schema<ITransaction>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    merchant: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    roundUp: { type: Number, required: true, min: 0 },
    originalAmount: { type: Number, min: 0.01 },
    isRoundUpProcessed: { type: Boolean, default: false },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ id: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ isRoundUpProcessed: 1 });

export const Transaction: Model<ITransaction> =
  (models.Transaction as Model<ITransaction>) ??
  model<ITransaction>("Transaction", transactionSchema);
