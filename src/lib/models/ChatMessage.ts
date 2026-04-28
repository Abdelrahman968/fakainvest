import { Schema, model, models, Document, Model, Types } from "mongoose";

export type ChatRole = "user" | "assistant";

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  role: ChatRole;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role:   { type: String, enum: ["user","assistant"], required: true },
    text:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

chatMessageSchema.index({ userId: 1, createdAt: 1 });

export const ChatMessage: Model<IChatMessage> =
  (models.ChatMessage as Model<IChatMessage>) ??
  model<IChatMessage>("ChatMessage", chatMessageSchema);
