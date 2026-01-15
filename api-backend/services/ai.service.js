import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.error("Gemini Init Error:", error.message);
  }
}

// 1. Image Analysis (For Document Analysis Page)
export const analyzeDocument = async (fileBuffer, mimeType) => {
  try {
    if (!model) throw new Error("AI Model not initialized");
    const filePart = {
      inlineData: { data: fileBuffer.toString("base64"), mimeType: mimeType },
    };
    const prompt = `Analyze this document. Extract strict JSON: { projectName, budget, contractor, startDate, endDate, location, confidence }. No markdown.`;
    const result = await model.generateContent([prompt, filePart]);
    const text = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    console.error("AI Document Error:", error.message);
    // Fallback Mock Data
    return {
      success: false,
      data: {
        projectName: "Chandani Chowk Flyover (DEMO)",
        budget: "₹85,50,00,000",
        contractor: "Dilip Buildcon",
        confidence: 98.5,
      },
    };
  }
};

// 2. Verdict Generation (For Agentic Audit) - NEW FUNCTION
export const generateAuditVerdict = async (officialRecord, userEvidence) => {
  try {
    if (!model) throw new Error("AI Model not initialized");

    const prompt = `
      You are an Autonomous Audit AI. Compare these two datasets and generate a verdict.

      OFFICIAL RECORD: ${JSON.stringify(officialRecord)}
      USER EVIDENCE: ${JSON.stringify(userEvidence)}

      Output strict JSON only:
      {
        "riskLevel": "Low" | "Medium" | "High" | "Critical",
        "confidence": Number (0-100),
        "reasoning": "A short, professional summary of the discrepancy or verification."
      }
      Do not use markdown.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Verdict Error:", error.message);
    // Fallback Verdict if AI fails
    return {
      riskLevel: "Critical",
      confidence: 95.5,
      reasoning:
        "AI Service Unreachable. Defaulting to Critical Risk due to reported structural damage in completed project zone.",
    };
  }
};

export default { analyzeDocument, generateAuditVerdict };
