import { generateAuditVerdict } from "./ai.service.js";
import Audit from "../models/audit.model.js";
import Report from "../models/report.model.js";
import OfficialRecord from "../models/officialRecord.model.js";
import axios from "axios";




export const performAgenticAudit = async (reportId) => {
  // 1. INTELLIGENT RETRIEVAL
  // Try to find the Real Report in DB
  const userReport = await Report.findById(reportId).populate("issue_id");

  if (!userReport) {
    throw new Error("Report not found");
  }

  // Construct the "Data Context" used for the audit
  let data = null;

  // REAL WORLD MODE: Fetch from OfficialRecord DB
  const categoryMap = {
    pothole: "Public Works",
    road: "Public Works",
    traffic: "Public Works",
    garbage: "Sanitation",
    "water supply": "Water Supply",
    streetlight: "Electricity",
  };

  const searchTerm =
    categoryMap[userReport.issue_id?.category] || "Public Works";

  let officialDoc = await OfficialRecord.findOne({
    department: { $regex: searchTerm, $options: "i" },
  });


  if (officialDoc) {
    data = {
      department: officialDoc.department,
      project: {
        name: officialDoc.projectName,
        contractor: officialDoc.contractor?.name || "Unknown",
        status: officialDoc.status,
        budget: officialDoc.budget?.formatted || officialDoc.budget?.amount,
        deadline: officialDoc.deadline || "N/A",
      },
      evidence: {
        desc: userReport.description,
        img: userReport.imageUrl,
      },
    };
  }

  if (!data) {
    throw new Error("Official Data not available for audit");
  }

  // 1.5. COMPUTER VISION VERIFICATION
  let mlVerification = null;
  let cvLog = { message: "👁️ Engaging Computer Vision...", type: "action" };

  try {
    if (data.evidence.img) {
      const mlRes = await axios.get("http://localhost:4000/predict", {
        params: { img_url: data.evidence.img },
      });
      mlVerification = mlRes.data;
      cvLog = {
        message: `👁️ Computer Vision: Verified '${mlVerification.prediction}' (${(
          mlVerification.probability * 100
        ).toFixed(1)}%)`,
        type: "success",
      };
    }
  } catch (err) {
    console.error("ML Verification Failed:", err.message);
    cvLog = {
      message: "👁️ Computer Vision: Service Unavailable (Skipping)",
      type: "warning",
    };
  }

  // 2. AI AUDIT (Compare Record vs Evidence)
  const aiResult = await generateAuditVerdict(data.project, {
    description: data.evidence.desc,
    mlVerification,
  });

  // 3. SAVE RESULT
  let audit = await Audit.findOne({ reportId });

  if (!audit) {
    audit = await Audit.create({
      reportId,
      status: "completed",
      verdict: aiResult.riskLevel,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning,
      officialRecord: {
        ...data.project,
        departmentName: data.department,
      },
      evidence: {
        description: data.evidence.desc,
        image: data.evidence.img,
      },
      aiLogs: [
        { message: "Initializing IntegrityAI Agent...", type: "system" },
        { message: `Routing to: ${data.department}...`, type: "action" },
        { message: `✔ Record Found: ${data.project.name}`, type: "success" },

        cvLog,
        {
          message: `⚠ AI VERDICT: ${aiResult.riskLevel} Risk Detected`,
          type: "warning",
        },
        { message: "✔ Audit Report Generated.", type: "success" },
      ],
    });
  }

  return audit;
};
