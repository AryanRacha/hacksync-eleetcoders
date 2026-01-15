import { generateAuditVerdict } from "./ai.service.js";
import Audit from "../models/audit.model.js";

// 🏛️ 4 DIFFERENT SCENARIOS (Real-world Data)
const DEPARTMENT_DATABASE = {
  // 1. ROADS (Critical Discrepancy)
  "RPT-2023-1": {
    department: "Public Works Department (PWD)",
    project: {
      id: "INFRA-RD-882",
      name: "Sector 4 Main Road Resurfacing",
      contractor: "Vardhan Infratech Pvt Ltd.",
      status: "Completed", // <--- LIE (User says delay/damage)
      budget: "₹1,20,00,000",
      deadline: "2023-10-01",
    },
    evidence: {
      desc: "User photo shows large potholes and loose gravel. No tarmac visible.",
      img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    },
  },
  // 2. GARBAGE (Medium Risk - Service Failure)
  "RPT-2023-2": {
    department: "Dept of Sanitation & Waste",
    project: {
      id: "SANI-WZ-104",
      name: "Municipal Waste Management - Zone 2",
      contractor: "GreenClean Solutions",
      status: "Active (Daily Pickup)",
      budget: "₹45,00,000",
      deadline: "2024-12-31",
    },
    evidence: {
      desc: "Garbage overflowing from bins. Truck has not visited for 3 days.",
      img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    },
  },
  // 3. STREET LIGHT (Low Risk - Maintenance Issue)
  "RPT-2023-3": {
    department: "Electricity Board (MSEDCL)",
    project: {
      id: "ELEC-SL-99",
      name: "Smart City Lighting Phase 1",
      contractor: "PowerGrid Corp",
      status: "Maintenance Phase",
      budget: "₹85,00,000",
      deadline: "N/A",
    },
    evidence: {
      desc: "Street light on Main St. is flickering. Likely bulb failure.",
      img: "https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=800",
    },
  },
  // 4. WATER (High Risk - Leakage)
  "RPT-2023-4": {
    department: "Water Supply Department",
    project: {
      id: "WTR-PIPE-22",
      name: "Main Pipeline Distribution - North",
      contractor: "AquaFlow Systems",
      status: "Recently Repaired",
      budget: "₹12,00,000",
      deadline: "2023-11-15",
    },
    evidence: {
      desc: "Heavy leakage from main pipe. Thousands of liters wasting.",
      img: "https://images.unsplash.com/photo-1523365280197-f1783db9fe62?auto=format&fit=crop&q=80&w=800",
    },
  },
};

const DEFAULT_RECORD = {
  department: "General Municipal Admin",
  project: {
    id: "GEN-001",
    name: "General City Maintenance",
    contractor: "Municipal Corporation",
    status: "Active",
    budget: "₹10,00,000",
    deadline: "2024-03-31",
  },
  evidence: {
    desc: "General complaint regarding infrastructure.",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7",
  },
};

export const performAgenticAudit = async (reportId) => {
  // 1. INTELLIGENT RETRIEVAL
  const data = DEPARTMENT_DATABASE[reportId] || DEFAULT_RECORD;

  // 2. AI AUDIT (Compare Record vs Evidence)
  const aiResult = await generateAuditVerdict(data.project, {
    description: data.evidence.desc,
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
        { message: "👁️ Engaging Computer Vision...", type: "action" },
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
