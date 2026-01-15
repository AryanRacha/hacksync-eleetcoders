import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const generateTokenAndSetCookie = (userId, role, res) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax", // works for localhost:5173 -> localhost:5000
    secure: false, // set to true when using HTTPS
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateTokenAndSetCookie;
