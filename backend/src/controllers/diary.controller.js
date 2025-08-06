import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import StudentModel from "../models/student.model.js";
import FeeFunctions from "../models/fee.model.js";
import { getMonthsBetweenDates } from "../utils/functions/functions.js";

const getStudentDiaryDesc = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;
    const currentSessionId = req.user?.settings?.sessionId;

    const student = await StudentModel.getStudentForParentDiary(
        studentId,
        currentSessionId
    );
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const { class_id, section_id, campus_id, section, program_applied_for } =
        student;

    // Fetch fee settings (start and end months of the session)
    const feeSetting = await FeeFunctions.getFeeSystemSetting(campus_id || 41); // fallback 41 like original

    const startDateStr = `01-${feeSetting.start_month_session}`;
    const endDateStr = `01-${feeSetting.end_month_session}`;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const session_months = getMonthsBetweenDates(startDate, endDate);
    const current_month = new Date().toLocaleString("default", {
        month: "short",
        year: "numeric",
    });

    // Replace with actual diary fetch logic (uncomment only one)
    // const diarylist = await DiaryModel.getStudentDiary(class_id, section_id, program_applied_for);
    // const diarylist = await DiaryModel.getStudentDiary2(class_id, section_id, campus_id, program_applied_for);

    const diarylist = []; // temporary placeholder

    res.status(200).json(
        new ApiResponse(
            200,
            {
                diarylist,
                class_id,
                section_id,
                student_id: studentId,
                subject_id: "",
                section_name: section,
                session_months,
                current_month,
            },
            "Student diary data fetched successfully"
        )
    );
});

export { getStudentDiaryDesc };
