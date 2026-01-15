import OfficialRecord from "../models/officialRecord.model.js";
import { analyzeDocument } from "../services/ai.service.js";

export const uploadContract = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { buffer, mimetype } = req.file;

        // Analyze document first using existing AI service
        const analysis = await analyzeDocument(buffer, mimetype);

        // If analysis fails, we might still want to upload? Or just return error?
        // Using fallback data logic from service if needed, but here let's assume success
        // Actually the service returns a standard structure

        const recordData = analysis.data;

        // Save to OfficialRecord Collection
        const newRecord = new OfficialRecord({
            projectName: recordData.projectName,
            department: recordData.department || "Public Works Department", // Default if missing
            description: `Contract for ${recordData.projectName}`,
            budget: {
                amount: typeof recordData.budget === 'object' ? recordData.budget.amount : parseFloat(recordData.budget?.replace(/[^0-9.]/g, '') || 0),
                formatted: typeof recordData.budget === 'object' ? recordData.budget.formatted : recordData.budget
            },
            contractor: {
                name: typeof recordData.contractor === 'object' ? recordData.contractor.name : recordData.contractor
            },
            status: recordData.status || "Planned",
            startDate: recordData.startDate,
            endDate: recordData.endDate,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.076], // Default Mumbai coords as AI can't easily extract geo-coords from text without Geocoding API
                address: recordData.location
            }
        });

        await newRecord.save();

        res.status(201).json({ message: "Contract analyzed and vaulted successfully", record: newRecord });

    } catch (error) {
        console.error("Contract upload error:", error);
        res.status(500).json({ message: "Server error during contract upload" });
    }
};

export const getAllContracts = async (req, res) => {
    try {
        const records = await OfficialRecord.find({}).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
