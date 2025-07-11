import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getStudentSubjects } from "../controllers/subject.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getStudentSubjects);

export default router;
