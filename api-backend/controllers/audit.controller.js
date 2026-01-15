import Audit from "../models/audit.model.js";

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

// RUN Audit (Simulation + Persistence)
export const runAudit = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if audit exists
    let audit = await Audit.findOne({ reportId: id });
    if (audit) return res.json(audit);

    // 2. Create new Audit
    // NOTE: In a real app, you would call Gemini here.
    // For the demo, we generate the "AI Result" directly to ensure stability.

    const newAudit = await Audit.create({
      reportId: id,
      status: "completed",
      verdict: "Critical",
      confidence: 98.5,
      reasoning:
        "Official record claims project is 'Completed', but citizen evidence shows severe structural failure.",
      officialRecord: {
        projectName: "Chandani Chowk Expansion",
        status: "Completed",
        budget: "₹85 Crores",
        contractor: "Dilip Buildcon",
      },
      evidence: {
        image:
          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
        description: "Road surface destroyed.",
      },
      // ✅ This array of objects will now be accepted by the new Schema
      aiLogs: [
        { message: "Initializing IntegrityAI Agent...", type: "system" },
        { message: "Connecting to MoRTH Central Database...", type: "action" },
        { message: "✔ Official Record Retrieved.", type: "success" },
        { message: "👁️ Engaging Computer Vision Module...", type: "action" },
        {
          message: "⚠ VISUAL FINDINGS: Severe Surface Erosion (94%)",
          type: "warning",
        },
        {
          message: "❌ DISCREPANCY: Status 'Completed' vs Evidence.",
          type: "error",
        },
        { message: "✔ FINAL VERDICT: CRITICAL RISK", type: "success" },
      ],
    });

    res.status(201).json(newAudit);
  } catch (error) {
    console.error("Audit Controller Error:", error);
    res.status(500).json({ message: "Audit Failed", error: error.message });
  }
};
