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
  // 1. Get product instance (check integrations)
  const product = await ProductInstance.findById(productInstanceId);

  if (!product) {
    throw new Error("Product instance not found");
  }

  // 2. Prepare steps (for UI)
  let steps: string[] = ["Analyzing user query"];

  // 3. Integration simulation
  let integrationContext = "";

  if (product.integrations?.shopify) {
    integrationContext += "Shopify data: Orders are stable.\n";
    steps.push("Checking Shopify data");
  }

  if (product.integrations?.crm) {
    integrationContext += "CRM data: Leads increased by 20%.\n";
    steps.push("Fetching CRM insights");
  }

  // 4. Final AI step
  steps.push("Generating AI response");

  // 5. Prepare AI input
  const aiInput = `
User Message: ${message}
${integrationContext}
Respond like an AI assistant.
`;

  // 6. AI response (mock)
  const aiResponse = await fakeAI(aiInput);

  // 7. Save conversation
  const conversation = await Conversation.create({
    projectId,
    productInstanceId,
    messages: [
      { role: "user", content: message },
      { role: "assistant", content: aiResponse },
    ],
  });

  // 8. Return clean response
  return {
    reply: aiResponse,
    steps,
    conversation,
  };
}

// 🔥 
async function fakeAI(input: string) {
  return `🤖 AI Response based on: ${input.substring(0, 80)}...`;
}