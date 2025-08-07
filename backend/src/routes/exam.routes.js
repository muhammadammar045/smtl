import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getExamSchedule } from "../controllers/exam.controller.js";

const router = express.Router();

router.get("/get-exam-schedule", authMiddleware, getExamSchedule);

export default router;
