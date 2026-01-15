import express from "express";
import { getAuditStatus, runAudit } from "../controllers/audit.controller.js";

const router = express.Router();

router.get("/:id", getAuditStatus);
router.post("/:id/analyze", runAudit);

export default router;
