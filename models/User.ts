import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "member";
  projectIds: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  projectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);