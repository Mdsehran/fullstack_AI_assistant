"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          userId: "123",
          projectId: "123",
          productInstanceId: "sales-assistant",
          message: input,
        }),
      });

      const data = await res.json();

      const botMessage = {
        role: "assistant",
        text: data?.data?.reply || "No response",
        steps: data?.data?.steps || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>

      {/* Messages */}
      <div className="border rounded p-4 h-[400px] overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <p
              className={
                msg.role === "user"
                  ? "text-right text-blue-600"
                  : "text-left text-gray-800"
              }
            >
              {msg.text}
            </p>

            {/* Steps */}
            {msg.steps && (
              <div className="text-xs text-gray-500 mt-1">
                {msg.steps.map((step: string, idx: number) => (
                  <div key={idx}>• {step}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <p className="text-gray-400">Thinking...</p>}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}