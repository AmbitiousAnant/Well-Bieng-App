import { GoogleGenAI, Type } from "@google/genai";
import { Message, SentimentAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeSentiment = async (messages: Message[]): Promise<SentimentAnalysis | null> => {
  if (messages.length === 0) return null;

  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment and emotional state of the User in the following conversation. Consider the context and nuances of recent interactions.\n\nConversation:\n${conversationText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "A sentiment score from 0 (very negative/distressed) to 100 (very positive/stable).",
            },
            dominantEmotion: {
              type: Type.STRING,
              description: "The most prominent emotion detected.",
            },
            nuance: {
              type: Type.STRING,
              description: "A brief, nuanced explanation of the user's emotional state.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score of the analysis from 0 to 1.",
            },
            detectedEmotions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  emotion: { type: Type.STRING },
                  intensity: { type: Type.NUMBER, description: "Intensity from 0 to 1." },
                },
                required: ["emotion", "intensity"],
              },
            },
          },
          required: ["score", "dominantEmotion", "nuance", "confidence", "detectedEmotions"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as SentimentAnalysis;
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return null;
  }
};
