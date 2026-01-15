import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import protectAdmin from "../middlewares/protectAdmin.js";

import {
  createIssue,
  getAllIssues,
  getIssueById,
  addReportToIssue,
  followIssue,
  unfollowIssue,
  updateIssueStatus,
  assignIssueToDept,
  deleteIssue,
} from "../controllers/issue.controller.js";
import multer from "multer";

const router = express.Router();
// Multer setup for memory storage (no file size limit)
const upload = multer({ storage: multer.memoryStorage() });

// --- Routes for All Logged-in Users ---

router.post("/", protectRoute, upload.array("images"), createIssue);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.post("/:id/report", protectRoute, addReportToIssue);

//This route when user clicks on follow button in trendings section
router.post("/:id/follow", protectRoute, followIssue);
router.post("/:id/unfollow", protectRoute, unfollowIssue);

// --- Admin Only Routes ---

router.put("/:id/status", protectRoute, protectAdmin, updateIssueStatus);
router.put("/:id/assign", protectRoute, protectAdmin, assignIssueToDept);
router.delete("/:id", protectRoute, protectAdmin, deleteIssue);

export default router;
