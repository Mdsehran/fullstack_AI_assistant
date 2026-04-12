"use client";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";

type Message = {
  role: "user" | "assistant";
  text: string;
  steps?: string[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending, isError, error } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    sendMessage(
      {
        message: userText,
        projectId: "project-123",
        productInstanceId: "sales-assistant",
        userId: "user-123",
      },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: data.reply, steps: data.steps },
          ]);
        },
        onError: (err: any) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: `Error: ${err.message}` },
          ]);
        },
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>

      {/* Empty state */}
      {messages.length === 0 && !isPending && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Send a message to start the conversation.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 border rounded p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <p
              className={
                msg.role === "user"
                  ? "text-right text-blue-600 font-medium"
                  : "text-left text-gray-800"
              }
            >
              {msg.text}
            </p>
            {msg.steps && msg.steps.length > 0 && (
              <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                {msg.steps.map((step, idx) => (
                  <div key={idx}>• {step}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading state */}
        {isPending && (
          <div className="text-left text-gray-400 animate-pulse">
            Thinking...
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-red-500 text-sm">
            {(error as Error)?.message || "Something went wrong."}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          disabled={isPending}
        />
        <button
          onClick={handleSend}
          disabled={isPending}
          className="bg-black text-white px-4 rounded disabled:opacity-50 transition-opacity"
        >
          {isPending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}