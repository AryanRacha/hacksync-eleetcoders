import AuditService from "../services/audit.service.js";
import AIService from "../services/ai.service.js";

export const performAudit = async (req, res) => {
    try {
        const { issueId } = req.params;
        const result = await AuditService.performAudit(issueId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const analyzeDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const metadata = await AIService.analyzeDocument(req.file.buffer, req.file.mimetype);
        res.status(200).json(metadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
