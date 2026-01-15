import express from "express";
import { performAudit, analyzeDocument } from "../controllers/audit.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:issueId/verify", performAudit);
router.post("/analyze", upload.single("document"), analyzeDocument);

export default router;
