import { Schema, model, models, Document, Model, Types } from "mongoose";


export interface IFamilyMember extends Document {
  parentUserId: Types.ObjectId;
  name: string;
  emoji: string;
  role: string;       // e.g. "Son", "Daughter", "Spouse"
  allowance: number;
  balance: number;
  weeklyLimit: number;
  spentThisWeek: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    parentUserId:  { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:          { type: String, required: true, trim: true, maxlength: 40 },
    emoji:         { type: String, default: "👤" },
    role:          { type: String, trim: true, default: "Member" },
    allowance:     { type: Number, default: 0, min: 0 },
    balance:       { type: Number, default: 0, min: 0 },
    weeklyLimit:   { type: Number, default: 500 },
    spentThisWeek: { type: Number, default: 0 },
    color:         { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

export const FamilyMember: Model<IFamilyMember> =
  (models.FamilyMember as Model<IFamilyMember>) ??
  model<IFamilyMember>("FamilyMember", familyMemberSchema);


export interface IFamilyChore extends Document {
  memberId: Types.ObjectId;
  parentUserId: Types.ObjectId;
  title: string;
  reward: number;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const familyChoreSchema = new Schema<IFamilyChore>(
  {
    memberId:     { type: Schema.Types.ObjectId, ref: "FamilyMember", required: true, index: true },
    parentUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:        { type: String, required: true, trim: true, maxlength: 100 },
    reward:       { type: Number, default: 0, min: 0 },
    done:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FamilyChore: Model<IFamilyChore> =
  (models.FamilyChore as Model<IFamilyChore>) ??
  model<IFamilyChore>("FamilyChore", familyChoreSchema);
