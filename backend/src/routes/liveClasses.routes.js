import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getStudentConferences } from "../controllers/liveClasses.controller.js";

const router = express.Router();

router.get("/get-live-classes", authMiddleware, getStudentConferences);

export default router;
