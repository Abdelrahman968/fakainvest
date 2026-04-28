import { Schema, model, models, Document, Model, Types } from "mongoose";

export type HoldingType =
  | "Savings Cert"
  | "Stocks"
  | "Gold"
  | "Money Market"
  | "Sukuk";

export interface IHolding extends Document {
  userId: Types.ObjectId;
  name: string;
  type: HoldingType;
  amount: number;
  return1m: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const holdingSchema = new Schema<IHolding>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: {
      type: String,
      enum: ["Savings Cert", "Stocks", "Gold", "Money Market", "Sukuk"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    return1m: { type: Number, required: true, default: 0 },
    color: { type: String, default: "199 89% 60%" },
  },
  { timestamps: true },
);

export const Holding: Model<IHolding> =
  (models?.Holding as Model<IHolding>) ||
  model<IHolding>("Holding", holdingSchema);

export type LeanHolding = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: HoldingType;
  amount: number;
  return1m: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};
