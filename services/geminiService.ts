
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll alert the user and proceed.
  // The feature will fail silently if the key is missing.
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateSmartReplies(message: Message): Promise<string[]> {
  if (!process.env.API_KEY) {
    return [];
  }

  const prompt = `
    Based on the following email, generate 3 short, distinct, and context-aware reply suggestions.
    Each reply should be a concise phrase or a short sentence, suitable for a "smart reply" button.
    Do not add any preamble or explanation. Just return the three suggestions.
    If the email is a notification or doesn't warrant a reply, suggest neutral acknowledgements.

    --- EMAIL ---
    From: ${message.from}
    Subject: ${message.subject}

    Body:
    ${message.body}
    --- END EMAIL ---

    SUGGESTED REPLIES:
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.5,
            maxOutputTokens: 100,
        }
    });
    
    const text = response.text;
    // The model might return replies prefixed with "-", "*", or numbers. Clean them up.
    const replies = text.split('\n').map(r => r.trim().replace(/^[-*•\d\.]+\s*/, '')).filter(Boolean);
    
    return replies.slice(0, 3);
  } catch (error) {
    console.error("Error generating smart replies:", error);
    return [];
  }
}
