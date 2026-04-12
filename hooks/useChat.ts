import { useMutation, useQueryClient } from "@tanstack/react-query";

type SendMessageParams = {
  message: string;
  projectId: string;
  productInstanceId: string;
  userId: string;
};

type ChatResponse = {
  reply: string;
  steps: string[];
};

async function sendMessageApi(params: SendMessageParams): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || `HTTP error: ${res.status}`);
  }

  return res.json();
}

export function useChat() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return mutation;
}