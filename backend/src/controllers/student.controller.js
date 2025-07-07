import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import StudentFunctions from "../models/student.model.js";
import GradesFunctions from "../models/grades.model.js";
import FeeFunctions from "../models/fee.model.js";
import TimelineFunctions from "../models/timeline.model.js";
import LanguageFunctions from "../models/language.model.js";
import SettingFunctions from "../models/setting.model.js";
import CategoryFunctions from "../models/category.model.js";

const getStudentDetails = asyncHandler(async (req, res) => {
    const studentId = req.user.student_id;

    const student = await StudentFunctions.getStudentById(studentId);
    if (!student) throw new ApiError(404, "Student not found");

    const gradeList = await GradesFunctions.getGradeList(
        student.campus_main_id
    );
    const feeSetting = await FeeFunctions.getFeeSystemSetting(
        student.campus_main_id
    );
    if (!feeSetting)
        throw new ApiError(500, "Settings not found for this campus");

    const feeSystem = feeSetting.fee_system;
    const studentDueFees = await FeeFunctions.getStudentDueFees(
        student.student_session_id,
        feeSystem === "school"
    );
    const studentDiscountFees = await FeeFunctions.getStudentFeeDiscounts(
        student.student_session_id
    );
    const timeline = await TimelineFunctions.getTimeline(student.id);
    const classLanguage = await LanguageFunctions.getClassLanguage(
        student.class_id
    );
    const settings = await SettingFunctions.getFullSettings(
        student.campus_main_id
    );
    if (!settings) throw new ApiError(500, "Full system settings not found");

    const studentDocs = await StudentFunctions.getStudentDocs(student.id);
    const categories = await CategoryFunctions.getCategoryList();

    const responseData = {
        student,
        gradeList,
        feeSystem,
        student_due_fee: studentDueFees,
        student_discount_fee: studentDiscountFees,
        timeline_list: timeline,
        classLanguage,
        getSetting: settings,
        student_doc: studentDocs,
        student_doc_id: student.id,
        category_list: categories,
    };

    res.json(
        new ApiResponse(200, responseData, "Student dashboard data fetched")
    );
});

export { getStudentDetails };
