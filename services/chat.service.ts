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
  const steps: string[] = ["Analyzing user query", "Generating AI response"];
  const reply = await callChatGPT(message);
  return { reply, steps };
}

async function callChatGPT(userMessage: string): Promise<string> {
  const res = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
      system_prompt: "",
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ChatGPT API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data?.result ?? data?.choices?.[0]?.message?.content ?? "No response from AI.";
}