import { Schema, model, models, Model, Document } from "mongoose";

export interface IMarketRate extends Document {
  name: string;
  value: number;
  unit: string;
  change: number;
  icon: string;
  color: string;
  updatedAt: Date;
  createdAt: Date;
}

const marketRateSchema = new Schema<IMarketRate>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    change: { type: Number, required: true, default: 0 },
    icon: { type: String, default: "📈" },
    color: { type: String, default: "199 89% 60%" },
  },
  { timestamps: true },
);

export const MarketRate: Model<IMarketRate> =
  (models.MarketRate as Model<IMarketRate>) ??
  model<IMarketRate>("MarketRate", marketRateSchema);
