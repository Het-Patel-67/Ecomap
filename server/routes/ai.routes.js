import express from "express";
import { generateReport } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected route
router.post("/impact-report", protect, generateReport);

export default router;