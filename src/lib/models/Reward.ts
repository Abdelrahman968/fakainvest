import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IReward extends Document {
  userId: Types.ObjectId;
  points: number;
  level: number;
  streakDays: number;
  badges: string[];
  completedChallenges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    points: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    streakDays: { type: Number, default: 0, min: 0 },
    badges: { type: [String], default: [] },
    completedChallenges: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Reward: Model<IReward> =
  (models.Reward as Model<IReward>) ?? model<IReward>("Reward", rewardSchema);
