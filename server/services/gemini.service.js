import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import ApiError from "../utils/ApiError.js";

export const generateImpactReport = async (prompt) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("GOOGLE_API_KEY exists:", !!apiKey);
  if (!apiKey) {
    throw new ApiError(500, "Google API key is not configured");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("FULL STRUCTURED RESPONSE:");
    console.log(JSON.stringify(response, null, 2));
    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new ApiError(500, "No candidate returned from Gemini");
    }

    const text = response.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!text) {
      throw new ApiError(500, "No text returned from AI");
    }

    return text;

  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw new ApiError(500, error.message || "Failed to generate impact report");
  }
};