import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const register = asyncHandler(async (req, res) => {
    const { username, password, role, is_active, def_status } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        throw new ApiError(400, "Username already exists");
    }

    const user = await User.create({ username, password, role, is_active, def_status });
    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(new ApiResponse(201, userResponse, "User created successfully"));
});

export { register };
