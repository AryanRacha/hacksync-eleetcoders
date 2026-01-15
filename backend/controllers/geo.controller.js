import Issue from "../models/issue.model.js";
import OfficialRecord from "../models/OfficialRecord.js";

export const getMapData = async (req, res) => {
    try {
        const { category, status } = req.query;

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const issues = await Issue.find(query).select("title category status location auditVerification");
        const records = await OfficialRecord.find({}).select("projectName status location budget");

        // Format as GeoJSON FeatureCollection
        const features = [
            ...issues.map(issue => ({
                type: "Feature",
                geometry: issue.location,
                properties: {
                    type: "Issue",
                    id: issue._id,
                    title: issue.title,
                    category: issue.category,
                    status: issue.status,
                    audit: issue.auditVerification
                }
            })),
            ...records.map(record => ({
                type: "Feature",
                geometry: record.location,
                properties: {
                    type: "OfficialRecord",
                    id: record._id,
                    title: record.projectName,
                    status: record.status,
                    budget: record.budget
                }
            }))
        ];

        res.status(200).json({
            type: "FeatureCollection",
            features
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
