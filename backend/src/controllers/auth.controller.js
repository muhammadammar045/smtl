import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import UserModel from "../models/user.model.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.checkLogin({ username, password });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    res.json(new ApiResponse(200, user[0], "Login successful"));
});





export { login };
