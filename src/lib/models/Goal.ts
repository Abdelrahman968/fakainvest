import { Schema, model, models, Document, Model, Types } from "mongoose";

export type GoalCategory =
  | "Travel"
  | "Apartment"
  | "Device"
  | "Education"
  | "Other";

export interface IGoal extends Document {
  userId: Types.ObjectId;
  title: string;
  emoji: string;
  category: GoalCategory;
  targetAmount: number;
  savedAmount: number;
  deadline: Date | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    emoji: { type: String, default: "🎯" },
    category: {
      type: String,
      enum: ["Travel", "Apartment", "Device", "Education", "Other"],
      default: "Other",
    },
    targetAmount: { type: Number, required: true, min: 1 },
    savedAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date, default: null },
    color: { type: String, default: "199 89% 60%" },
  },
  { timestamps: true },
);


export const Goal: Model<IGoal> =
  (models?.Goal as Model<IGoal>) || model<IGoal>("Goal", goalSchema);

export interface IGoalContribution extends Document {
  goalId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const goalContributionSchema = new Schema<IGoalContribution>(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export const GoalContribution: Model<IGoalContribution> =
  (models?.GoalContribution as Model<IGoalContribution>) ||
  model<IGoalContribution>("GoalContribution", goalContributionSchema);

export type LeanGoal = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  emoji: string;
  category: GoalCategory;
  targetAmount: number;
  savedAmount: number;
  deadline: Date | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LeanGoalContribution = {
  _id: Types.ObjectId;
  goalId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
};
