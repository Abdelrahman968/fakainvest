import { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  displayName: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 80,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ displayName: 1 });

export const User: Model<IUser> =
  (models.User as Model<IUser>) ?? model<IUser>("User", userSchema);
