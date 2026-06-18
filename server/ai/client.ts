import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { trackAIFailure } from "../monitoring/tracker";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function getAIResponse(
  prompt: string,
  context: { endpoint: string; correlationId: string; userId: string }
) {
  const rawOpenAIKey = process.env.OPENAI_API_KEY?.trim();
  let openaiKey = rawOpenAIKey;

  if (rawOpenAIKey) {
    const match = rawOpenAIKey.match(/sk-[a-zA-Z0-9_-]{32,}/);
    if (match) openaiKey = match[0];
  }

  if (openaiKey && openaiKey.startsWith('sk-')) {
    try {
      const openaiClient = new OpenAI({ apiKey: openaiKey });
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      const content = response.choices[0].message.content || "";
      if (content) return content;
    } catch (error: any) {
      console.error("OpenAI Error:", error.message || error);
      trackAIFailure({
        timestamp: new Date().toISOString(),
        correlationId: context.correlationId,
        endpoint: context.endpoint,
        userId: context.userId,
        error: `OpenAI: ${error.message || String(error)}`
      });
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
        }
      });
      return response.text || "";
    } catch (error: any) {
      console.error("Gemini Error:", error.message || error);
      trackAIFailure({
        timestamp: new Date().toISOString(),
        correlationId: context.correlationId,
        endpoint: context.endpoint,
        userId: context.userId,
        error: `Gemini: ${error.message || String(error)}`
      });
      throw new Error(`AI error (Gemini): ${error.message || "Failed to generate response"}`);
    }
  }

  const noAiConfigErr = "No valid AI configuration found. Please check both OpenAI and Gemini keys in the Secrets panel.";
  trackAIFailure({
    timestamp: new Date().toISOString(),
    correlationId: context.correlationId,
    endpoint: context.endpoint,
    userId: context.userId,
    error: noAiConfigErr
  });
  throw new Error(noAiConfigErr);
}
