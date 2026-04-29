import { Schema, model, models, Model } from "mongoose";

export type RoundUpMode = "None" | "Eco" | "Boost" | "Fixed20" | "Custom";

export interface IUserSettings extends Document {
  userId: string;
  roundUpEnabled: boolean;
  roundUpMode: RoundUpMode;
  customRoundUpAmount: number;
  roundUpTargetGoalId?: string;
  roundUpAutoInvestThreshold: number;
  roundUpLastProcessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    roundUpEnabled: { type: Boolean, default: true },
    roundUpMode: {
      type: String,
      enum: ["None", "Eco", "Boost", "Fixed20", "Custom"],
      default: "Eco",
    },
    customRoundUpAmount: { type: Number, default: 10, min: 5, max: 100 },
    roundUpTargetGoalId: { type: String, required: false },
    roundUpAutoInvestThreshold: {
      type: Number,
      default: 20,
      min: 10,
      max: 200,
    },
    roundUpLastProcessedAt: { type: Date },
  },
  { timestamps: true },
);

export const UserSettings: Model<IUserSettings> =
  models.UserSettings ??
  model<IUserSettings>("UserSettings", userSettingsSchema);
