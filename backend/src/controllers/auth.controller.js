import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(new ApiResponse(200, userResponse, "Login successful"));
});

export { login };
