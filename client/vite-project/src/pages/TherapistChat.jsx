// src/pages/TherapistChat.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { sendTherapyMessage } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";

export default function TherapistChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Per-user storage key so each user sees only their own chat history
  const storageKey = user?.id ? `therapistChatHistory_${user.id}` : "therapistChatHistory";

  // initial assistant prompt if no history
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
        return;
      } catch (e) {
        // ignore parse error
      }
    }

    setMessages([
      {
        role: "assistant",
        content: "Hello — I'm your virtual therapist. How are you feeling today?",
      },
    ]);
  }, [storageKey]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (_) { }
  }, [messages, storageKey]);

  // auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send message flow
  const sendMessage = async (text) => {
    if (!text) return;
    setLoading(true);

    // append user message locally
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // prepare simple history you want to send to backend (optional)
    const historyForServer = messages.map((m) => ({ role: m.role, content: m.content }));

    // call backend (backend should reply with { success: true, reply: "..." })
    const result = await sendTherapyMessage(text, historyForServer);

    const replyText = result?.reply || "Sorry, something went wrong. Please try again.";

    setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.currentTarget.prompt.value.trim();
    if (!input) return;
    e.currentTarget.reset();
    sendMessage(input);
  };

  // small quick-actions (optional): send breathing prompt / gratitude / motivational
  const sendQuick = (text) => sendMessage(text);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl mb-6 font-bold gradient-title inline-block">Therapist Chatbot</h1>

        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-3 bg-gray-50 rounded">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}

          <div ref={endRef} />
          {loading && <p className="text-gray-500 italic">Typing...</p>}
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() =>
              sendQuick(
                "I feel anxious — can you guide me through a short breathing exercise?"
              )
            }
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm"
          >
            Breathing
          </button>

          <button
            onClick={() =>
              sendQuick(
                "I am feeling low and unmotivated — can you give a short motivational quote and prompt?"
              )
            }
            className="px-3 py-2 bg-green-50 text-green-700 rounded-md text-sm"
          >
            Motivation
          </button>

          <button
            onClick={() =>
              sendQuick("I want a short gratitude prompt to reflect on today.")
            }
            className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-md text-sm"
          >
            Gratitude
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            name="prompt"
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
