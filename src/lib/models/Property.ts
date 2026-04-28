import { Schema, model, models, Document, Model, Types } from "mongoose";

export type PropertyType = "Residential" | "Commercial" | "Vacation" | "Office";

export interface IProperty extends Document {
  name: string;
  location: string;
  emoji: string;
  totalValue: number;
  sharePrice: number;
  totalShares: number;
  sharesAvailable: number;
  yieldPct: number;
  appreciation1y: number;
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
    totalValue: { type: Number, required: true, min: 0 },
    sharePrice: { type: Number, required: true, min: 0.01 },
    totalShares: { type: Number, required: true, min: 1 },
    sharesAvailable: { type: Number, required: true, min: 0 },
    yieldPct: { type: Number, default: 0 },
    appreciation1y: { type: Number, default: 0 },
    occupancy: { type: Number, default: 100, min: 0, max: 100 },
    type: {
      type: String,
      enum: ["Residential", "Commercial", "Vacation", "Office"],
      required: true,
    },
    color: { type: String, default: "#6366f1" },
  },
  { timestamps: true },
);

export const Property: Model<IProperty> =
  (models.Property as Model<IProperty>) ??
  model<IProperty>("Property", propertySchema);

export interface IPropertyHolding extends Document {
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  sharesOwned: number;
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const propertyHoldingSchema = new Schema<IPropertyHolding>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    sharesOwned: { type: Number, required: true, min: 1 },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

propertyHoldingSchema.index({ userId: 1, propertyId: 1 });

export const PropertyHolding: Model<IPropertyHolding> =
  (models.PropertyHolding as Model<IPropertyHolding>) ??
  model<IPropertyHolding>("PropertyHolding", propertyHoldingSchema);
