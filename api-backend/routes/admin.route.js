import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import protectAdmin from "../middlewares/protectAdmin.js"; 

import {
  getUserById,
  createDepartment,
  getAllDepartments,
  getAllUsersByCategoriesHandledByDepartment,
  getAllUsersByZoneByDepartment
} from "../controllers/admin.controller.js";

const router = express.Router();

// router.get("/stats", protectRoute, protectAdmin, getDashboardStats); iska doubt hai ayega kya krke ye route coz admin k liye nhi hoga ye
// router.get("/users", protectRoute, protectAdmin, getAllUsers); //niche mth likha to find users by filter
router.get("/users/:id", protectRoute, protectAdmin, getUserById); 

router.post("/departments", protectRoute, protectAdmin, createDepartment);
router.get("/departments", protectRoute, protectAdmin, getAllDepartments);

// IF WANTS TO FIND USERS HANDLED BY DEPARTMENT BASED ON CATEGORIES HANDLED OR ZONE
router.get(
  "/departments/:id/user-by-categories",
  protectRoute,
  protectAdmin,
  getAllUsersByCategoriesHandledByDepartment,
);
router.get(
  "/departments/:id/user-by-zone",
  protectRoute,
  protectAdmin,
  getAllUsersByZoneByDepartment
);


export default router;
