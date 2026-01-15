import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  loginUser,
  logoutUser,
  signupUser,
  forgotPassword,
  changePassword,
  verifyOtpAndUpdatePassword
} from "../controllers/auth.controller.js";

const router = express.Router();

// SignUp
router.post("/signup", signupUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", protectRoute, logoutUser);

// Change Pasword
router.post("/change-password", changePassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtpAndUpdatePassword);

export default router;
