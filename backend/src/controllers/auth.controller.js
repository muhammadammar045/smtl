// src/controllers/auth.controller.js
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../helpers/tokens.js";
import StudentFunctions from "../models/student.model.js";
import ParentFunctions from "../models/parent.model.js";
import SettingFunctions from "../models/setting.model.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const user = await StudentFunctions.findUserByUsernameAndPassword(
        username,
        password
    );
    if (!user) throw new ApiError(401, "Invalid Username or Password");

    if (user.is_active !== "yes" || user.def_status !== "enable") {
        throw new ApiError(
            403,
            "Your account is disabled. Please contact administrator."
        );
    }

    const role = user.role;
    let result;
    let responseData = {};
    let payload = {};

    if (role === "student") {
        result = await StudentFunctions.getStudentInfo(user.id);
    } else if (role === "parent") {
        result = await ParentFunctions.getParentInfo(username, password);
    }

    if (!result) {
        throw new ApiError(403, "Account suspended or student not active");
    }

    const setting = await SettingFunctions.getSchoolSettings();
    if (!setting) {
        throw new ApiError(500, "System settings not found");
    }

    if (role === "student") {
        responseData.student = {
            id: result.id,
            student_id: result.user_id,
            role: result.role,
            username: `${result.firstname} ${result.lastname}`,
            image: result.image,
            settings: {
                date_format: setting.date_format,
                currency_symbol: setting.currency_symbol,
                timezone: setting.timezone,
                sessionId: setting.session_id,
                campusId: setting.campus_id,
                sch_name: setting.name,
                language: {
                    lang_id: setting.lang_id,
                    language: setting.language,
                },
                is_rtl: setting.is_rtl,
                theme: setting.theme,
            },
        };
        payload = responseData.student;
    } else if (role === "parent") {
        const siblings = await ParentFunctions.getSiblingsByParentId(result.id);

        const childStudent = siblings.map((s) => ({
            student_id: s.id,
            name: `${s.firstname} ${s.lastname}`,
        }));

        responseData.parent = {
            id: result.id,
            parent_id: result.user_id,
            role: result.role,
            username: result.guardian_name,
            image:
                result.guardian_relation === "Father"
                    ? result.father_pic
                    : result.guardian_relation === "Mother"
                    ? result.mother_pic
                    : result.guardian_pic,
            settings: {
                date_format: setting.date_format,
                currency_symbol: setting.currency_symbol,
                timezone: setting.timezone,
                sch_name: setting.name,
                language: {
                    lang_id: setting.lang_id,
                    language: setting.language,
                },
                is_rtl: setting.is_rtl,
                theme: setting.theme,
            },
            children: childStudent,
        };
        payload = responseData.parent;
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
        .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json(
            new ApiResponse(
                200,
                {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: responseData.student || responseData.parent,
                },
                "Login successful"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        const decoded = verifyRefreshToken(refresh_token);
        const newAccessToken = generateAccessToken(decoded);

        res.json(
            new ApiResponse(
                200,
                { access_token: newAccessToken },
                "Access token refreshed"
            )
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
});

export { login, refreshAccessToken };
