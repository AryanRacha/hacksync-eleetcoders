import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import protectAdmin from "../middlewares/protectAdmin.js";
import multer from "multer";
import { uploadContract, getAllContracts } from "../controllers/officialRecord.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protectRoute, protectAdmin, upload.single("document"), uploadContract);
router.get("/", protectRoute, protectAdmin, getAllContracts);

export default router;
