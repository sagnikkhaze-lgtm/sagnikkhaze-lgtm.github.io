import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function askProjectAI({
  itemTitle,
  itemContext,
  userQuestion,
  history = [],
}: {
  itemTitle: string;
  itemContext: string;
  userQuestion: string;
  history?: Array<{ sender: "user" | "ai"; text: string }>;
}): Promise<string> {
  const systemInstruction = `You are a specialized AI assistant for Sagnik Nag's portfolio project / blog post titled "${itemTitle}".
Your job is to answer ANY and EVERYTHING the user asks about this project or post clearly, accurately, and concisely.

Here is the authoritative context and documentation for "${itemTitle}":
---
${itemContext}
---

Rules:
- Give direct, helpful, and insightful technical answers.
- Explain code, architecture, usage, memory rules, or features when asked.
- Keep responses friendly, structured, and easy to read.`;

  if (ai) {
    try {
      const contents = [
        ...history.map((h) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        })),
        {
          role: "user",
          parts: [{ text: userQuestion }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn("Gemini API call warning:", err);
    }
  }

  // Smart fallback using context extraction when API key is pending
  const lower = userQuestion.toLowerCase();
  if (lower.includes("how") || lower.includes("work") || lower.includes("explain")) {
    return `Here is how "${itemTitle}" works based on its technical blueprint:\n\n${itemContext.slice(0, 350)}...`;
  } else if (lower.includes("stack") || lower.includes("language") || lower.includes("built")) {
    return `"${itemTitle}" is built with clean architecture and strict developer standards:\n\n${itemContext.slice(0, 300)}`;
  } else if (lower.includes("install") || lower.includes("run") || lower.includes("use")) {
    return `To run or use "${itemTitle}":\n\n\`\`\`sh\ngit clone https://github.com/sagnikkhaze-lgtm/${itemTitle.toLowerCase().replace(/\s+/g, "-")}\n\`\`\`\n\n${itemContext.slice(0, 250)}`;
  }

  return `Regarding "${itemTitle}":\n\n${itemContext.slice(0, 400)}...\n\nAsk me anything else about this project's code, structure, or implementation!`;
}
