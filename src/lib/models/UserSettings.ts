import { Schema, model, models, Model } from "mongoose";

export interface IUserSettings extends Document {
  userId: string;
  roundUpMode: "Normal" | "Medium" | "Aggressive";
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    roundUpMode: { 
      type: String, 
      enum: ["Normal", "Medium", "Aggressive"], 
      default: "Medium" 
    },
  },
  { timestamps: true }
);

export const UserSettings: Model<IUserSettings> =
  models.UserSettings ?? model<IUserSettings>("UserSettings", userSettingsSchema);