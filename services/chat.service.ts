import Conversation from "../models/Conversation";
import ProductInstance from "../models/ProductInstance";

type SendMessageParams = {
  projectId: string;
  productInstanceId: string;
  message: string;
};

export async function sendMessageService({
  projectId,
  productInstanceId,
  message,
}: SendMessageParams) {
  // 1. Get product instance (to check integrations)
  const product = await ProductInstance.findById(productInstanceId);

  if (!product) {
    throw new Error("Product instance not found");
  }

  // 2. Simulate integrations
  let integrationContext = "";

  if (product.integrations?.shopify) {
    integrationContext += "Shopify data: Orders are stable.\n";
  }

  if (product.integrations?.crm) {
    integrationContext += "CRM data: Leads increased by 20%.\n";
  }

  // 3. Prepare AI input
  const aiInput = `
User Message: ${message}
${integrationContext}
Respond like an AI assistant.
`;

  // 4. Call AI (mock for now)
  const aiResponse = await fakeAI(aiInput);

  // 5. Save conversation
  const conversation = await Conversation.create({
    projectId,
    productInstanceId,
    messages: [
      { role: "user", content: message },
      { role: "assistant", content: aiResponse },
    ],
  });

  return {
    reply: aiResponse,
    conversation,
  };
}

// Temporary AI (we'll replace with real API)
async function fakeAI(input: string) {
  return `AI Response based on: ${input.substring(0, 50)}...`;
}