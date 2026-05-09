import { GoogleGenAI, Type } from "@google/genai";
import { CaseSheet } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeConsultation(transcript: string): Promise<CaseSheet> {
  const prompt = `
    As an expert dental scribe, convert the following dental consultation transcript into a structured case sheet.
    Include:
    1. Critical alerts (especially allergies or systemic issues).
    2. Chief Complaints: List of the primary issues the patient is reporting.
    3. VAS Score: A Visual Analogue Scale score (0-10) for pain based on patient description.
    4. Medical History: Relevant medical history comments or observations.
    5. Radiographic findings.
    6. Clinical observations.
    7. Multi-phase treatment plan (with priority and estimated cost in INR if possible).
    8. Home care actions.
    9. Revenue/production value estimates.
    
    Transcript: ${transcript}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            criticalAlert: { type: Type.STRING },
            chiefComplaints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            vasScore: { type: Type.NUMBER },
            medicalHistory: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            radiographicFindings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            clinicalObservations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            treatmentPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  procedure: { type: Type.STRING },
                  teeth: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  cost: { type: Type.NUMBER }
                },
                required: ["phase", "procedure", "teeth", "priority"]
              }
            },
            homeCare: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            revenueOpportunity: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.STRING },
                treatmentUrgency: { type: Type.STRING },
                productionValue: { type: Type.STRING },
                uptakeProbability: { type: Type.STRING }
              },
              required: ["amount", "treatmentUrgency", "productionValue", "uptakeProbability"]
            }
          },
          required: [
            "chiefComplaints",
            "vasScore",
            "medicalHistory",
            "radiographicFindings", 
            "clinicalObservations", 
            "treatmentPlan", 
            "homeCare", 
            "revenueOpportunity"
          ]
        }
      }
    });

    return JSON.parse(response.text || "{}") as CaseSheet;
  } catch (error) {
    console.error("AI Summarization failed:", error);
    throw error;
  }
}
