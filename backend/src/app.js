import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import logger from "./utils/logger.js";
import session from "express-session";

import authRoutes from "./routes/auth.routes.js";
import studentsRoutes from "./routes/student.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "ammarkey123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

const morganFormat =
    ":method :url :status :res[content-length] - :response-time ms :http-version - :user-agent";

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const [
                    method,
                    url,
                    status,
                    contentLength,
                    responseTime,
                    httpVersion,
                    userAgent,
                ] = message.match(/(\S+)/g);

                const logObject = {
                    method,
                    url,
                    status,
                    contentLength: contentLength.replace(/[^0-9]/g, ""),
                    responseTime: responseTime.replace("ms", "").trim(),
                    httpVersion,
                    userAgent,
                };

                logger.info("", logObject);
            },
        },
    })
);
console.log("cors origin:", process.env.CORS_ORIGIN);

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
        success: false,
        data: null,
    });
});

export default app;
