// src/services/api.js
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
import { API_BASE_URL } from "../config/env";

export async function sendTherapyMessage(text, history = []) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/therapy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }), // server can accept history or ignore
    });

    if (!res.ok) {
      throw new Error(`Server responded ${res.status}`);
    }

    const data = await res.json();
    // Expecting: { success: true, reply: "..." } from backend
    return data;
  } catch (err) {
    console.error("sendTherapyMessage error:", err);
    // fallback mock response so UI works during frontend development
    return {
      success: false,
      reply:
        "Sorry, the therapy service is temporarily unreachable. Try again later or use a simple breathing exercise: Inhale 4s — Hold 4s — Exhale 4s.",
    };
  }
}
