import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  emoji: string;
  description: string;
  reward: string;
  rewardPoints: number;
  target: number;
  durationDays: number;
  participants: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    emoji: { type: String, default: "🏆" },
    description: { type: String, required: true, trim: true },
    reward: { type: String, required: true },
    rewardPoints: { type: Number, required: true, min: 0 },
    target: { type: Number, required: true, min: 1 },
    durationDays: { type: Number, required: true, min: 1 },
    participants: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Challenge: Model<IChallenge> =
  (models.Challenge as Model<IChallenge>) ??
  model<IChallenge>("Challenge", challengeSchema);
