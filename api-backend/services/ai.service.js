import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // FIXED: Using 'gemini-pro' to avoid 404
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
  } catch (error) {
    console.error("Gemini Init Error:", error.message);
  }
}

// Named Export
export const analyzeDocument = async (fileBuffer, mimeType) => {
  try {
    if (!model) throw new Error("AI Model not initialized");

    const filePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const prompt = `Analyze this document. Extract strict JSON: { projectName, budget, contractor, startDate, endDate, location, confidence }. No markdown.`;

    const result = await model.generateContent([prompt, filePart]);
    const cleanJson = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    return { success: true, data: JSON.parse(cleanJson) };
  } catch (error) {
    console.error("AI Service Error:", error.message);
    return {
      success: false,
      data: {
        projectName: "Chandani Chowk Flyover Expansion (DEMO)",
        budget: "₹85,50,00,000",
        contractor: "Dilip Buildcon Ltd.",
        startDate: "2026-02-01",
        endDate: "2027-08-15",
        location: "Pune Bypass, Maharashtra",
        confidence: 98.5,
      },
    };
  }
};

// Default Export (Prevents 'audit.controller.js' from crashing)
export default { analyzeDocument };
