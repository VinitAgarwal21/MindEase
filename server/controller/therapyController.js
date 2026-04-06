// server/controller/therapyController.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();

console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Model name works with SDK v0.24.1
const MODEL_NAME = "gemini-2.5-flash";

// Optional motivational content
const motivationalQuotes = [
  "You are stronger than you think.",
  "This too shall pass.",
  "Be patient with yourself. Healing takes time.",
  "Your feelings are valid.",
  "Progress, not perfection.",
];

const breathingExercise = `Let's try a short breathing exercise:
- Inhale slowly through your nose for 4 seconds.
- Hold your breath for 4 seconds.
- Exhale gently through your mouth for 4 seconds.
Repeat this for a minute. Let your mind settle.`;

const gratitudePrompt = `Take a moment to reflect on something you're grateful for today.
It could be a small moment, a person, or even your own resilience.`;

export async function handleTherapyMessage(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, reply: "Message is missing." });
    }

    // ✅ Create model (new API format)
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      systemInstruction: {
        parts: [
          {
            text:
              "You are a compassionate mental health therapist. Respond with empathy and support in a calm tone. Keep answers concise, simple, and easy for an anxious person to read. Use short sentences and minimal text. Briefly validate feelings, then offer 1–2 gentle questions or simple coping suggestions (e.g., breathing exercises, grounding, gratitude journaling). Avoid long explanations or complex language. Suggest helpline numbers if user expresses severe distress. Always be supportive and non-judgmental.",
          },
        ],
      },
    });

    // ✅ Use generateContent (simpler & compatible)
    const result = await model.generateContent({
      contents: [
        ...history.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ],
    });

    const reply = result.response.text().trim();

    // ✅ Add supportive extras
    const lower = message.toLowerCase();
    const extras = [];

    if (Math.random() < 0.3) {
      extras.push(`💬 Quote: "${motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"`);
    }

    if (lower.includes("anxious") || lower.includes("panic")) {
      extras.push(`🧘 *Breathing Exercise:*\n${breathingExercise}`);
    }

    if (lower.includes("empty") || lower.includes("unmotivated")) {
      extras.push(`📓 *Gratitude Prompt:*\n${gratitudePrompt}`);
    }

    const fullReply = [reply, ...extras].join("\n\n");
    res.json({ success: true, reply: fullReply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({
      success: false,
      reply: "I'm sorry, I had trouble processing that. Please try again.",
    });
  }
}
