import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import logger from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

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
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
        success: false,
        data: null,
    });
});

export default app;
