import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getStudentAttendanceReport } from "../controllers/attendance.controller.js";

const router = express.Router();

router.get("/get-attendance", authMiddleware, getStudentAttendanceReport);

export default router;
