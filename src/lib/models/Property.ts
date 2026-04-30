import { Schema, model, models, Model, Document } from "mongoose";

export type PropertyType = "Residential" | "Commercial" | "Vacation" | "Office";

export interface IProperty extends Document {
  name: string;
  location: string;
  emoji: string;
  total_value: number;
  share_price: number;
  shares_available: number;
  total_shares: number;
  yield_pct: number;
  appreciation_1y: number;
  occupancy: number;
  type: PropertyType;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    emoji: { type: String, default: "🏢" },
    total_value: { type: Number, required: true, min: 0 },
    share_price: { type: Number, required: true, min: 0 },
    shares_available: { type: Number, required: true, min: 0 },
    total_shares: { type: Number, required: true, min: 0 },
    yield_pct: { type: Number, required: true, default: 0 },
    appreciation_1y: { type: Number, required: true, default: 0 },
    occupancy: { type: Number, required: true, default: 0, min: 0, max: 100 },
    type: {
      type: String,
      enum: ["Residential", "Commercial", "Vacation", "Office"],
      required: true,
    },
    color: { type: String, default: "199 89% 60%" },
  },
  { timestamps: true },
);

export const Property: Model<IProperty> =
  (models.Property as Model<IProperty>) ??
  model<IProperty>("Property", propertySchema);
