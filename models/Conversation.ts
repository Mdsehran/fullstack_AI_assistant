import { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  productInstanceId: {
    type: Schema.Types.ObjectId,
    ref: "ProductInstance",
  },
  messages: [
    {
      role: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);

export default Conversation;