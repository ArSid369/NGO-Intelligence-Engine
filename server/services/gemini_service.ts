import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function analyzeNeedText(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following NGO report and extract the structured data.
    
    Report: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING, description: "The location of the need" },
          need_type: { type: Type.STRING, description: "The type of need: food, medical, shelter, or other" },
          people: { type: Type.INTEGER, description: "The number of people affected" },
          urgency: { type: Type.STRING, description: "The urgency level: low, medium, or high" }
        },
        required: ["location", "need_type", "people", "urgency"]
      }
    }
  });

  const jsonStr = response.text?.trim();
  if (!jsonStr) throw new Error("Failed to generate JSON");
  return JSON.parse(jsonStr);
}

export async function explainDecision(volunteer: any, need: any) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain in 1-2 sentences why this volunteer was matched to this need.
    
    Need: ${JSON.stringify(need)}
    Volunteer: ${JSON.stringify(volunteer)}`,
  });

  return response.text?.trim() || "Explanation not available.";
}
