import express from "express";
import { getDashboardNotifications } from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/get-dashboard-notifications",
    authMiddleware,
    getDashboardNotifications
);

export default router;
