import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IPropertyHolding extends Document {
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  shares: number;
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
      index: true,
    },
    shares: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

propertyHoldingSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export const PropertyHolding: Model<IPropertyHolding> =
  (models.PropertyHolding as Model<IPropertyHolding>) ??
  model<IPropertyHolding>("PropertyHolding", propertyHoldingSchema);
