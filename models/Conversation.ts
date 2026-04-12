import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  projectId: string;
  productInstanceId: string;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    projectId: { type: String, required: true },
    productInstanceId: { type: String, required: true },
    userId: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);