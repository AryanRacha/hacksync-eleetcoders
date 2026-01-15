import mongoose from "mongoose";
const Schema = mongoose.Schema;

const officialRecordSchema = new Schema(
    {
        projectName: {
            type: String,
            required: [true, "Project Name is required."],
            trim: true,
            index: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
            index: true, // e.g., "Public Works Department", "Sanitation"
        },
        description: {
            type: String,
            default: "",
        },
        budget: {
            amount: { type: Number }, // e.g. 12000000
            currency: { type: String, default: "INR" },
            formatted: { type: String }, // e.g. "₹1.2 Cr" - to keep original string format if needed
        },
        contractor: {
            name: { type: String, required: true },
            contactInfo: { type: String },
        },
        status: {
            type: String,
            enum: [
                "Planned",
                "In Progress",
                "Completed",
                "Stalled",
                "Active",
                "Maintenance Phase",
                "Recently Repaired",
            ],
            required: true,
        },
        startDate: { type: Date },
        endDate: { type: Date },
        deadline: { type: String }, // Keeping as string to match "2023-10-01" or "N/A" from mocks easily
        location: {
            type: {
                type: String,
                enum: ["Point", "Polygon"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]
                default: [0, 0],
            },
            address: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

// 2dsphere index for geospatial queries
officialRecordSchema.index({ location: "2dsphere" });

const OfficialRecord = mongoose.model("OfficialRecord", officialRecordSchema);
export default OfficialRecord;
