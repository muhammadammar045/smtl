import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../helpers/tokens.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.access_token ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Authorization token is missing");
    }

    try {
        const decoded = verifyAccessToken(token);

        // Optional: You can validate user existence in DB here if needed
        // const user = await User.findById(decoded.id); // e.g. Mongoose-style
        // if (!user) throw new ApiError(401, "User not found");

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default authMiddleware;
