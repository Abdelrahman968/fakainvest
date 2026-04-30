import { Schema, model, models, Model, Document } from "mongoose";

export interface ICashbackOffer extends Document {
  brand: string;
  category: string;
  cashback: string;
  cashbackValue: number;
  emoji: string;
  color: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cashbackOfferSchema = new Schema<ICashbackOffer>(
  {
    brand: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    cashback: { type: String, required: true },
    cashbackValue: { type: Number, required: true, default: 0 },
    emoji: { type: String, default: "🛍️" },
    color: { type: String, default: "199 89% 60%" },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CashbackOffer: Model<ICashbackOffer> =
  (models.CashbackOffer as Model<ICashbackOffer>) ??
  model<ICashbackOffer>("CashbackOffer", cashbackOfferSchema);
