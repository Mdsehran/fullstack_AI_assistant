import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug: string;
  users: mongoose.Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);