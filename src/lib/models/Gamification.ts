import { Schema, model, models, Document, Model, Types } from "mongoose";


export interface IChallenge extends Document {
  title: string;
  description: string;
  emoji: string;
  rewardPoints: number;
  durationDays: number;
  participants: number;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String, trim: true, default: "" },
    emoji:        { type: String, default: "🏆" },
    rewardPoints: { type: Number, default: 0 },
    durationDays: { type: Number, default: 7 },
    participants: { type: Number, default: 0 },
    startsAt:     { type: Date, default: null },
    endsAt:       { type: Date, default: null },
  },
  { timestamps: true }
);

export const Challenge: Model<IChallenge> =
  (models.Challenge as Model<IChallenge>) ??
  model<IChallenge>("Challenge", challengeSchema);


export interface IReward extends Document {
  userId: Types.ObjectId;
  points: number;
  level: number;
  streakDays: number;
  badges: string[];            // badge slugs
  completedChallenges: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    userId:               { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    points:               { type: Number, default: 0 },
    level:                { type: Number, default: 1 },
    streakDays:           { type: Number, default: 0 },
    badges:               { type: [String], default: [] },
    completedChallenges:  { type: [Schema.Types.ObjectId], ref: "Challenge", default: [] },
  },
  { timestamps: true }
);

export const Reward: Model<IReward> =
  (models.Reward as Model<IReward>) ?? model<IReward>("Reward", rewardSchema);


export interface IChallengeProgress extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  progress: number;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const challengeProgressSchema = new Schema<IChallengeProgress>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
    progress:    { type: Number, default: 0, min: 0, max: 100 },
    joinedAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

challengeProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const ChallengeProgress: Model<IChallengeProgress> =
  (models.ChallengeProgress as Model<IChallengeProgress>) ??
  model<IChallengeProgress>("ChallengeProgress", challengeProgressSchema);
