import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
// The API key is injected via process.env.API_KEY
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
