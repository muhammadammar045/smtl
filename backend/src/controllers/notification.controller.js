import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import NotificationFunctions from "../models/notification.model.js";
import ParentFunctions from "../models/parent.model.js";

const getDashboardNotifications = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;

    const campus = await ParentFunctions.getStudentForParent(studentId);

    const notifications = await NotificationFunctions.getNotificationForStudent(
        studentId,
        campus.campus_main_id
    );
    res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );
});

export { getDashboardNotifications };
