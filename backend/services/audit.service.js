import Issue from "../models/issue.model.js";
import Report from "../models/report.model.js";
import OfficialRecord from "../models/OfficialRecord.js";
import AIService from "./ai.service.js";

export const AuditService = {
    /**
     * Performs a full audit on a specific report/issue.
     * @param {String} issueId 
     */
    performAudit: async (issueId) => {
        try {
            // 1. Data Retrieval
            const issue = await Issue.findById(issueId);
            if (!issue) throw new Error("Issue not found");

            const report = await Report.findOne({ issue_id: issueId }); // Assuming one main report for now
            // Logic could be expanded to check multiple reports

            // Find Official Record near the issue location (within 500 meters)
            const officialRecords = await OfficialRecord.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: issue.location.coordinates,
                        },
                        $maxDistance: 500, // 500 meters
                    },
                },
            });

            const matchedRecord = officialRecords[0]; // Take the closest one for now

            let riskLevel = "Low";
            let status = "Verified";
            let reasoning = "";
            let aiResult = null;

            // 2. Audit Logic
            if (!matchedRecord) {
                status = "No Record";
                riskLevel = "Medium";
                reasoning = "No official government record found for a project at this location. This might be an unplanned repair or a ghost project.";
            } else {
                // We have a record. Compare status.
                // If Official Record says "Completed" but User reports "Pothole" -> High Risk
                // If Official Record says "In Progress" and User reports "Construction Material" -> Low Risk

                // Verify Evidence with AI
                // We need the image buffer. In a real app, we'd fetch the image from the URL.
                // For this hackathon, we might assume the image analysis happened at upload, 
                // OR we just use metadata if we can't fetch the URL here.
                // Let's assume we proceed with logic first.

                if (matchedRecord.status === "Completed" && issue.category === "pothole") {
                    riskLevel = "High";
                    reasoning = `Official record '${matchedRecord.projectName}' is marked as Completed, but a pothole was reported. Potential quality failure.`;
                } else if (matchedRecord.status === "Planned" && issue.status === "Submitted") {
                    riskLevel = "Low";
                    reasoning = "Project is in planning phase, on-ground work hasn't started yet.";
                } else {
                    reasoning = `Matched with project '${matchedRecord.projectName}'. Status: ${matchedRecord.status}.`;
                }
            }

            // 3. Verdict Update
            issue.auditVerification = {
                status,
                riskLevel,
                officialRecordId: matchedRecord ? matchedRecord._id : null,
                reasoning,
                aiAnalysis: aiResult
            };

            await issue.save();
            return issue.auditVerification;

        } catch (error) {
            console.error("Audit Service Error:", error);
            throw error;
        }
    }
};

export default AuditService;
