import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  displayName: string;
  email: string;
  phone?: string;
  avatarEmoji: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId:               { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName:          { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
    email:                { type: String, required: true, trim: true, lowercase: true },
    phone:                { type: String, trim: true, default: null },
    avatarEmoji:          { type: String, default: "🦋" },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Profile: Model<IProfile> =
  (models.Profile as Model<IProfile>) ?? model<IProfile>("Profile", profileSchema);
