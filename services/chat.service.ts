// services/chat.service.ts
import { connectDB } from "@/lib/mongodb";
import Conversation from "../models/Conversation";
import ProductInstance from "../models/ProductInstance";

type SendMessageParams = {
  projectId: string;
  productInstanceId: string;
  userId: string;
  message: string;
};

export async function sendMessageService({
  projectId,
  productInstanceId,
  userId,
  message,
}: SendMessageParams) {
  await connectDB();

  const instance = await ProductInstance.findOne({
    projectId,
    nameSpace: productInstanceId,
  });

  const integrations = instance?.integrations;
  const steps: string[] = ["Analyzing user query"];
  let integrationContext = "";

  if (integrations?.shopify) {
    integrationContext += "Shopify: 142 active orders, revenue up 12% this week.\n";
    steps.push("Checking Shopify data");
  }

  if (integrations?.crm) {
    integrationContext += "CRM: 38 new leads this week, conversion rate at 24%.\n";
    steps.push("Fetching CRM insights");
  }

  steps.push("Generating AI response");

  const reply = await callChatGPT(message, integrationContext);

  await Conversation.create({
    projectId,
    productInstanceId,
    userId,
    messages: [
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ],
  });

  return { reply, steps };
}

async function callChatGPT(
  userMessage: string,
  integrationContext: string
): Promise<string> {
  const prompt = integrationContext
    ? `You are an AI sales assistant. Here is current business context:\n${integrationContext}\nUser: ${userMessage}`
    : userMessage;

  const res = await fetch(
    "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        system_prompt: "You are a helpful AI sales assistant.",
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ChatGPT API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return (
    data?.result ??
    data?.choices?.[0]?.message?.content ??
    "No response from AI."
  );
}