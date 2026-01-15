import mongoose from "mongoose";

const officialRecordSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    budget: { type: String, required: true },
    contractor: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    location: { type: String },
    confidence: { type: Number },
}, { timestamps: true });
const OfficialRecord = mongoose.models.OfficialRecord || mongoose.model("OfficialRecord", officialRecordSchema);
export default OfficialRecord;
