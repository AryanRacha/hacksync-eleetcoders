import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  reportId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "completed",
  },
  verdict: { type: String },
  confidence: Number,
  reasoning: String,
  officialRecord: Object,
  evidence: Object,

  // ✅ FIX: Define aiLogs as an array of Objects (not Strings)
  aiLogs: [
    {
      message: { type: String },
      type: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const Audit = mongoose.model("Audit", auditSchema);
export default Audit;
