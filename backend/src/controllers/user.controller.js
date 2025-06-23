import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    // const existingUser = await Student.findOne({
    //     where: { rollNumber: req.body.rollNumber },
    // });
    // if (existingUser) {
    //     throw new ApiError(400, "rollNumber already exists");
    // }
    // const user = await Student.create(req.body);
    // if (!user) {
    //     throw new ApiError(500, "Failed to create user");
    // }
    // const userResponse = user.toJSON();
    // delete userResponse.password;
    // res.json(
    //     new ApiResponse(201, userResponse, "Student created successfully")
    // );
});

export { register };
