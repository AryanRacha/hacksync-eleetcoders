import Issue from "../models/issue.model.js";
import OfficialRecord from "../models/officialRecord.model.js";

export const getMapData = async (req, res) => {
    try {
        const { category, status, lat, lng, radius } = req.query;

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        // Apply proximity filter if lat/lng are provided
        if (lat && lng) {
            const rad = radius ? parseFloat(radius) : 25; // Default 25km
            query.location = {
                $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], rad / 6371] // Using 6371km as Earth's radius
                }
            };
        }

        const issues = await Issue.find(query).select("title category status location auditVerification defaultImageUrl defaultDescription");
        const records = await OfficialRecord.find(lat && lng ? { location: query.location } : {}).select("projectName status location budget");

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
                    audit: issue.auditVerification,
                    imageUrl: issue.defaultImageUrl,
                    description: issue.defaultDescription
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
