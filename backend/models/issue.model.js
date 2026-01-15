import mongoose from "mongoose";
const Schema = mongoose.Schema;

const issueSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    category: {
      type: String,
      enum: ["pothole", "traffic", "water supply", "garbage", "streetlight"],
      required: [true, "Category is required."],
    },
    status: {
      type: String,
      required: true,
      enum: ["Submitted", "In Progress", "Resolved"],
      default: "Submitted",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    firstReportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    defaultImageUrl: { type: String, trim: true },
    defaultDescription: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    report_id: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    follow_id: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assignedTo: { type: Schema.Types.ObjectId, ref: "Department" },
    auditVerification: {
      status: {
        type: String,
        enum: ["Pending", "Verified", "Discrepancy", "No Record"],
        default: "Pending",
      },
      riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Low",
      },
      officialRecordId: { type: Schema.Types.ObjectId, ref: "OfficialRecord" },
      aiAnalysis: { type: Object }, // To store raw AI results
      reasoning: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

issueSchema.index({ location: "2dsphere" });

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
