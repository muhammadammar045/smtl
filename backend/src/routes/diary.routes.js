import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getStudentDiaryDesc } from "../controllers/diary.controller.js";

const router = express.Router();

router.get("/get-diary", authMiddleware, getStudentDiaryDesc);

export default router;
