// src/components/ChatMessage.jsx
import React from "react";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[70%] break-words p-3 rounded-lg ${
        isUser ? "bg-blue-100 ml-auto text-right" : "bg-green-50 mr-auto text-left"
      }`}
    >
      <p className="text-sm whitespace-pre-line">{content}</p>
    </div>
  );
}
