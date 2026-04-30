import { Schema, model, models, Model, Document } from "mongoose";

export interface IBankCertificate extends Document {
  bank: string;
  name: string;
  rate: number;
  term: string;
  min: number;
  isBest: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const bankCertificateSchema = new Schema<IBankCertificate>(
  {
    bank: { type: String, required: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    term: { type: String, required: true },
    min: { type: Number, required: true, min: 0 },
    isBest: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const BankCertificate: Model<IBankCertificate> =
  (models.BankCertificate as Model<IBankCertificate>) ??
  model<IBankCertificate>("BankCertificate", bankCertificateSchema);
