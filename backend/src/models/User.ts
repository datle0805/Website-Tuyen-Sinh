import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  name?: string;
  oauthProvider?: string;
  oauthId?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    name: { type: String },
    oauthProvider: { type: String },
    oauthId: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
