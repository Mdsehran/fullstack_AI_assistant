"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string; steps?: string[] }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "123",
          productInstanceId: "sales-assistant",
          message: input,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();
      const reply = data?.reply ?? data?.data?.reply ?? "No response";
      const steps = data?.steps ?? data?.data?.steps ?? [];

      setMessages((prev) => [...prev, { role: "assistant", text: reply, steps }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>

      <div className="border rounded p-4 h-[400px] overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <p className={msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}>
              {msg.text}
            </p>
            {msg.steps && msg.steps.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {msg.steps.map((step, idx) => (
                  <div key={idx}>• {step}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-gray-400 animate-pulse">Thinking...</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}