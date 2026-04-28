import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IReferral extends Document {
  userId: Types.ObjectId;
  code: string;
  totalEarned: number;
  rewardPerSignup: number;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    totalEarned: { type: Number, default: 0 },
    rewardPerSignup: { type: Number, default: 50 },
  },
  { timestamps: true },
);

export const Referral: Model<IReferral> =
  (models.Referral as Model<IReferral>) ??
  model<IReferral>("Referral", referralSchema);


export type ReferralStatus = "Active" | "Pending" | "Inactive";

export interface IReferralSignup extends Document {
  referralId: Types.ObjectId; // → Referral
  referrerId: Types.ObjectId; // → User
  name: string;
  avatar: string;
  status: ReferralStatus;
  earned: number;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSignupSchema = new Schema<IReferralSignup>(
  {
    referralId: {
      type: Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
      index: true,
    },
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: "👤" },
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Pending",
    },
    earned: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ReferralSignup: Model<IReferralSignup> =
  (models.ReferralSignup as Model<IReferralSignup>) ??
  model<IReferralSignup>("ReferralSignup", referralSignupSchema);
