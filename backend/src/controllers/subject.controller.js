import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ParentFunctions from "../models/parent.model.js";
import SubjectFunctions from "../models/subject.model.js";

const getStudentSubjects = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;
    const currentSession = req.user.settings.sessionId;

    const student = await ParentFunctions.getForParent(
        studentId,
        currentSession
    );

    if (!student) throw new ApiError(404, "Student not found");

    const { class_id, section_id, program_applied_for } = student;

    const subjectList = await SubjectFunctions.getSubjectByClassSectionAndGroup(
        class_id,
        section_id,
        program_applied_for,
        currentSession
    );

    res.json(
        new ApiResponse(200, subjectList, "Subject list fetched successfully")
    );
});

export { getStudentSubjects };
