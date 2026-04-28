import { Schema, model, models, Document, Model, Types } from "mongoose";

export type TransferType = "sent" | "received" | "deposit" | "topup" | "card";
export type TransferMethod = "Wallet" | "Bank" | "Card";

export interface ITransfer extends Document {
  userId: Types.ObjectId;
  type: TransferType;
  counterparty: string;
  counterpartyId?: Types.ObjectId;
  avatar: string;
  amount: number;
  note?: string;
  method: TransferMethod;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new Schema<ITransfer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["sent", "received", "deposit", "topup", "card"],
      required: true,
    },
    counterparty: { type: String, required: true, trim: true },
    counterpartyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    avatar: { type: String, default: "💸" },
    amount: { type: Number, required: true, min: 0.01 },
    note: { type: String, trim: true, default: "" },
    method: { type: String, enum: ["Wallet", "Bank", "Card"], required: true },
  },
  {
    timestamps: true,
    statics: {},
  },
);

transferSchema.index({ userId: 1, createdAt: -1 });

export const Transfer: Model<ITransfer> =
  (models.Transfer as Model<ITransfer>) ??
  model<ITransfer>("Transfer", transferSchema);
