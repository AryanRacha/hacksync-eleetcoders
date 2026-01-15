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
        description: {
            type: String,
            required: true,
        },
        budget: {
            amount: { type: Number, required: true },
            currency: { type: String, default: "INR" },
        },
        contractor: {
            name: { type: String, required: true },
            contactInfo: { type: String },
        },
        status: {
            type: String,
            enum: ["Planned", "In Progress", "Completed", "Stalled"],
            required: true,
        },
        startDate: { type: Date },
        endDate: { type: Date },
        location: {
            type: {
                type: String,
                enum: ["Point", "Polygon"],
                required: true,
            },
            coordinates: {
                type: [Number], // For Point: [lng, lat], For Polygon: [[[lng, lat], ...]]
                required: true,
            },
            // Optional: Store address text for searchability
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
