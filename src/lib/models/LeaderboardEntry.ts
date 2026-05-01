import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface ILeaderboardEntry extends Document {
  userId: Types.ObjectId;
  userName: string;
  userAvatar: string;
  score: number;
  month: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "🦊" },
    score: { type: Number, required: true, min: 0 },
    month: { type: String, required: true, index: true }, // YYYY-MM
  },
  { timestamps: true },
);

leaderboardEntrySchema.index({ month: 1, score: -1 });

export const LeaderboardEntry: Model<ILeaderboardEntry> =
  (models.LeaderboardEntry as Model<ILeaderboardEntry>) ??
  model<ILeaderboardEntry>("LeaderboardEntry", leaderboardEntrySchema);
