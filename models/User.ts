import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  projectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

const User = models.User || model("User", UserSchema);

export default User;