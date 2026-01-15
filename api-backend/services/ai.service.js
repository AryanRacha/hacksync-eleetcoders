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
    const prompt = `Analyze this document. Extract strict JSON with these fields:
    - projectName
    - department (e.g., "Public Works Department", "Sanitation")
    - budget (amount, formatted)
    - contractor (name)
    - status (must be one of: "Planned", "In Progress", "Completed", "Stalled", "Active", "Maintenance Phase", "Recently Repaired")
    - startDate
    - endDate
    - location (address)
    - confidence (0-100)
    
    No markdown.`;
    const result = await model.generateContent([prompt, filePart]);
    const text = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    console.error("AI Document Error:", error.message);
    throw new Error(`AI Document Analysis Failed: ${error.message}`);
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

      NOTE: If 'mlVerification' is present in USER EVIDENCE, it contains Computer Vision analysis.
      - "prediction": what the CV model detected (e.g., 'pothole', 'garbage').
      - "probability": confidence of the CV model.
      Use this to validate the user's description. If CV confirms the issue (e.g. pothole), increase confidence and risk level accordingly.

      Output strict JSON only:
      {
        "riskLevel": "Low" | "Medium" | "High" | "Critical",
        "confidence": Number (0-100),
        "reasoning": "A short, professional summary of the discrepancy or verification, explicitly mentioning if Computer Vision confirmed the issue."
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
    throw new Error(`AI Verdict Generation Failed: ${error.message}`);
  }
};


export default { analyzeDocument, generateAuditVerdict };
