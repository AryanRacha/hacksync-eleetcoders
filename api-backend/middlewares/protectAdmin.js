import dotenv from "dotenv";
dotenv.config();

const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Forbidden - Admin Access Only" });
  }
};

export default protectAdmin;
