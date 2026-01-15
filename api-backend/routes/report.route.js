import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  getAllReports,
  getUserReports,
  getReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", getAllReports);
router.get("/user", protectRoute, getUserReports);
router.get("/:report_id", protectRoute, getReport);
router.put("/:report_id", protectRoute, updateReport);
router.delete("/:report_id", protectRoute, deleteReport);

export default router;
