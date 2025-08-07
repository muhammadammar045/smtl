import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import StudentFunctions from "../models/student.model.js";
import ExamScheduleFunctions from "../models/exam.model.js";

// GET /api/student/exam-schedule
const getExamSchedule = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;
    const sessionId = req.user?.settings?.sessionId;

    if (!studentId || !sessionId) {
        throw new ApiError(400, "Student or session info missing.");
    }

    // 1. Get recent student record
    const studentRecord = await StudentFunctions.getRecentRecord(
        studentId,
        sessionId
    );

    if (!studentRecord) {
        throw new ApiError(404, "Student record not found");
    }

    const { class_id, section_id, campus_id } = studentRecord;

    // 2. Get exam schedule
    const examSchedule = await ExamScheduleFunctions.getExamByClassAndSection(
        class_id,
        section_id,
        campus_id,
        sessionId
    );

    // 3. Send response
    res.status(200).json(
        new ApiResponse(200, examSchedule, "Exam schedule fetched successfully")
    );
});

export { getExamSchedule };
