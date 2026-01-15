import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getMyReportedIssues,
  getFollowedIssues,
  getNearbyLocations,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protectRoute, getMyProfile);
router.put("/profile", protectRoute, updateMyProfile);
router.delete("/profile", protectRoute, deleteMyAccount);
router.get("/my-issues", protectRoute, getMyReportedIssues);
router.get("/followed-issues", protectRoute, getFollowedIssues);
router.get("/locations-near-me", protectRoute, getNearbyLocations);

export default router;
