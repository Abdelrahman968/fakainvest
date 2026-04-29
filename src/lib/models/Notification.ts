import { Schema, model, models, Document, Model, Types } from "mongoose";

export type NotificationType =
  | "alert"
  | "milestone"
  | "ai"
  | "social"
  | "success"
  | "error";

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  body: string;
  emoji: string;
  type: NotificationType;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true, default: "" },
    emoji: { type: String, default: "🔔" },
    type: {
      type: String,
      enum: ["alert", "milestone", "ai", "social", "success", "error"],
      default: "alert",
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  (models.Notification as Model<INotification>) ??
  model<INotification>("Notification", notificationSchema);
