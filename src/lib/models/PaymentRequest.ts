import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IPaymentRequest extends Document {
  requesterId: Types.ObjectId;
  requesterName: string;
  recipientId: Types.ObjectId;
  recipientName: string;
  amount: number;
  note: string;
  status: "pending" | "completed" | "rejected" | "expired";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentRequestSchema = new Schema<IPaymentRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

paymentRequestSchema.index({ recipientId: 1, status: 1 });
paymentRequestSchema.index({ requesterId: 1, createdAt: -1 });

export const PaymentRequest: Model<IPaymentRequest> =
  (models.PaymentRequest as Model<IPaymentRequest>) ??
  model<IPaymentRequest>("PaymentRequest", paymentRequestSchema);
