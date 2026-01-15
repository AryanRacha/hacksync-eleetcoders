import Audit from "../models/audit.model.js";
import { performAgenticAudit } from "../services/audit.service.js"; // ✅ Import Service

// GET Status
export const getAuditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const audit = await Audit.findOne({ reportId: id });
    if (!audit) return res.status(404).json({ message: "Not audited yet" });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RUN Audit (Real AI + ML Verification)
export const runAudit = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the Agentic Service
    const audit = await performAgenticAudit(id);

    res.status(201).json(audit);
  } catch (error) {
    console.error("Audit Controller Error:", error);
    res.status(500).json({ message: "Audit Failed", error: error.message });
  }
};
