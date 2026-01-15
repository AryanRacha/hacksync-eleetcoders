import dotenv from "dotenv";
dotenv.config();

const protectAdmin = async (req, res, next) => {
  try {
    const isAdmin = role[req.user.role] === "admin";
    if (isAdmin) {
      return res
        .status(401)
        .json({ success: false, message: "Forbidden - No Admin Access" });
    }

    next();
  } catch (error) {
    console.error("Error in protectAdmin middleware:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default protectAdmin;
