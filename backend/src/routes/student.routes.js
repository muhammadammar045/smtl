import express from "express";
import { getStudentDetails } from "../controllers/student.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/student-details", authMiddleware, getStudentDetails);

export default router;
