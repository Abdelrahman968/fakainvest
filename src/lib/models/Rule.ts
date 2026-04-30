import { Schema, model, models, Model, Document, Types } from "mongoose";

export interface IRule extends Document {
  userId: Types.ObjectId;
  triggerText: string;
  triggerEmoji: string;
  actionText: string;
  actionEmoji: string;
  enabled: boolean;
  triggeredCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ruleSchema = new Schema<IRule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    triggerText: { type: String, required: true, trim: true, maxlength: 100 },
    triggerEmoji: { type: String, default: "⚡", maxlength: 10 },
    actionText: { type: String, required: true, trim: true, maxlength: 100 },
    actionEmoji: { type: String, default: "✨", maxlength: 10 },
    enabled: { type: Boolean, default: true },
    triggeredCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

ruleSchema.index({ userId: 1, enabled: 1 });
ruleSchema.index({ userId: 1, createdAt: -1 });

export const Rule: Model<IRule> =
  (models.Rule as Model<IRule>) ?? model<IRule>("Rule", ruleSchema);

export const ruleTemplates = [
  {
    trigger: "Every coffee",
    action: "+10 EGP to Gold",
    triggerEmoji: "☕",
    actionEmoji: "🪙",
  },
  {
    trigger: "Every Uber",
    action: "+5 EGP to Stocks",
    triggerEmoji: "🚗",
    actionEmoji: "📈",
  },
  {
    trigger: "Every payday",
    action: "Auto-save 10%",
    triggerEmoji: "💰",
    actionEmoji: "🏦",
  },
  {
    trigger: "Spending over 1k",
    action: "Notify Gemini",
    triggerEmoji: "💸",
    actionEmoji: "🔔",
  },
];
