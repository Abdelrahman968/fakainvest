import { Schema, model, models, Document, Model, Types } from "mongoose";


export interface IBudgetCategory extends Document {
  userId: Types.ObjectId;
  name: string;
  emoji: string;
  cap: number;
  spent: number;
  lastMonth: number;
  monthKey: string; // "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const budgetCategorySchema = new Schema<IBudgetCategory>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:      { type: String, required: true, trim: true, maxlength: 40 },
    emoji:     { type: String, default: "📦" },
    cap:       { type: Number, required: true, min: 0 },
    spent:     { type: Number, default: 0, min: 0 },
    lastMonth: { type: Number, default: 0 },
    monthKey:  { type: String, default: () => new Date().toISOString().slice(0, 7) },
  },
  { timestamps: true }
);

budgetCategorySchema.index({ userId: 1, name: 1, monthKey: 1 }, { unique: true });

export const BudgetCategory: Model<IBudgetCategory> =
  (models.BudgetCategory as Model<IBudgetCategory>) ??
  model<IBudgetCategory>("BudgetCategory", budgetCategorySchema);


export interface IAutomationRule extends Document {
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

const automationRuleSchema = new Schema<IAutomationRule>(
  {
    userId:         { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    triggerText:    { type: String, required: true, trim: true },
    triggerEmoji:   { type: String, default: "⚡" },
    actionText:     { type: String, required: true, trim: true },
    actionEmoji:    { type: String, default: "🤖" },
    enabled:        { type: Boolean, default: true },
    triggeredCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AutomationRule: Model<IAutomationRule> =
  (models.AutomationRule as Model<IAutomationRule>) ??
  model<IAutomationRule>("AutomationRule", automationRuleSchema);
