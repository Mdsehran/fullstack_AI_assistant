import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Project = models.Project || model("Project", ProjectSchema);

export default Project;