import { Schema, model, models, Model, Document } from "mongoose";

export type BadgeRarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface IBadge extends Document {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: BadgeRarity;
  condition: string;
  requiredValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    description: { type: String, required: true },
    rarity: {
      type: String,
      enum: ["Common", "Rare", "Epic", "Legendary"],
      required: true,
    },
    condition: { type: String, required: true },
    requiredValue: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Badge: Model<IBadge> =
  (models.Badge as Model<IBadge>) ?? model<IBadge>("Badge", badgeSchema);
