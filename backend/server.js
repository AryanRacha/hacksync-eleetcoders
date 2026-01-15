import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

// website routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import reportRouter from "./routes/report.route.js";
import issueRouter from "./routes/issue.route.js";
import adminRouter from "./routes/admin.route.js";
import auditRouter from "./routes/audit.route.js";
import geoRouter from "./routes/geo.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"], // your React.js frontend URL
    credentials: true, // allow cookies to be sent
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Its working!!" });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/audit", auditRouter);
app.use("/api/geo", geoRouter);

app.get("/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectDB();
  console.log(`Backend Server is working on http://localhost:${PORT}`);
});
