import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Service to handle AI operations using Google Gemini
 */
export const AIService = {
    /**
     * Analyzes an infrastructure document (PDF/Image) to extract metadata.
     * @param {Buffer} fileBuffer - The file buffer
     * @param {String} mimeType - Docker mime type
     * @returns {Object} Extracted JSON metadata (Project Name, Budget, etc.)
     */
    analyzeDocument: async (fileBuffer, mimeType) => {
        try {
            const prompt = `
        Analyze this document (which might be a government tender, invoice, or project report).
        Extract the following fields in strict JSON format:
        - projectName: (string)
        - budget: (number, just the amount)
        - contractor: (string)
        - status: (string, e.g., "Planned", "In Progress", "Completed")
        - location: (string, address or coordinates if available)
        
        If a field is missing, use null. do NOT use markdown formatting (no \`\`\`json).
      `;

            const imagePart = {
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType,
                },
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            let text = response.text();

            // Clean up markdown code blocks if present
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(text);
        } catch (error) {
            console.error("AI Document Analysis Error:", error);
            throw new Error("Failed to analyze document");
        }
    },

    /**
     * Verifies if an image contains a specific infrastructure issue.
     * @param {Buffer} fileBuffer 
     * @param {String} mimeType 
     * @param {String} claimedIssueType - e.g., "Pothole", "Garbage"
     * @returns {Object} verification result { isMatch: boolean, confidence: string, details: string }
     */
    verifyEvidence: async (fileBuffer, mimeType, claimedIssueType) => {
        try {
            const prompt = `
          Analyze this image. The user claims this shows a "${claimedIssueType}".
          1. Does the image clearly show a "${claimedIssueType}"? (Yes/No)
          2. Estimate the severity (Low, Medium, High).
          3. Describe what you see in 1 sentence.
          
          Return JSON format:
          {
            "isMatch": boolean,
            "severity": "Low" | "Medium" | "High",
            "description": string
          }
           Do NOT use markdown formatting.
        `;

            const imagePart = {
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType,
                },
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(text);
        } catch (error) {
            console.error("AI Evidence Verification Error:", error);
            throw new Error("Failed to verify evidence");
        }
    }
};

export default AIService;
