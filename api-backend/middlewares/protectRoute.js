import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies["token"];
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn("User not found for decoded token ID");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default protectRoute;
