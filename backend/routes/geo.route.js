import express from "express";
import { getMapData } from "../controllers/geo.controller.js";

const router = express.Router();

router.get("/data", getMapData);

export default router;
