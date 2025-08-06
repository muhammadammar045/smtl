import { DateTime } from "luxon";
import asyncHandler from "../utils/asyncHandler.js";
import SettingFunctions from "../models/setting.model.js";
import AttendanceFunctions from "../models/attendance.model.js";
import StudentFunctions from "../models/student.model.js";
import ApiResponse from "../utils/ApiResponse.js";
const getStudentAttendanceReport = asyncHandler(async (req, res) => {
    const sessionId = req.user?.settings?.sessionId;
    const userId = req.user?.student_id;

    if (!sessionId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Missing student ID or session information",
        });
    }

    const student = await StudentFunctions.getStudentByIdInAttendance(
        userId,
        sessionId
    );

    if (!student || !student.id) {
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }

    const settings = await SettingFunctions.getSettings(
        null,
        student.campus_main_id,
        {
            session_array: {
                session_id: sessionId,
                session: req.user.settings.sessionName || "",
            },
        }
    );

    const today = DateTime.now().setZone("Asia/Karachi");
    const fromDate = DateTime.fromFormat("01-10-2021", "dd-MM-yyyy");
    const toDate = today;

    const startMonth = fromDate.startOf("month");
    const endMonth = toDate.endOf("month").plus({ days: 1 });

    const monthlyResults = {};

    for (let dt = startMonth; dt < endMonth; dt = dt.plus({ months: 1 })) {
        const monthKey = dt.toFormat("yyyy-MM");
        const monthStart = dt.startOf("month");
        const monthEnd = dt.endOf("month");

        const isFutureMonth = monthEnd > today;
        const actualEnd = isFutureMonth ? today : monthEnd;
        const daysInMonth = actualEnd.diff(monthStart, "days").days + 1;

        let sundays = 0;
        for (let d = monthStart; d <= actualEnd; d = d.plus({ days: 1 })) {
            if (d.weekday === 7) sundays++;
        }

        const attendanceDetails =
            await AttendanceFunctions.searchAttendanceReportByStudentId(
                student.id,
                monthStart.toFormat("yyyy-MM-dd"),
                actualEnd.toFormat("yyyy-MM-dd")
            );

        monthlyResults[monthKey] = {
            days: daysInMonth,
            sunday_no: sundays,
            details: attendanceDetails || [],
        };
    }

    const attendanceSummary = {};

    for (const [month, value] of Object.entries(monthlyResults)) {
        let count_present = 0;
        let count_absent = 0;
        let count_late = 0;
        let count_half = 0;
        let count_leave = 0;
        let count_holiday = 0;
        let count_off = 0;
        let workingDays = 0;

        for (const entry of value.details) {
            switch (entry.type) {
                case "Present":
                    count_present++;
                    workingDays++;
                    break;
                case "Absent":
                    count_absent++;
                    workingDays++;
                    break;
                case "Late":
                    count_late++;
                    workingDays++;
                    break;
                case "Half Day":
                    count_half++;
                    workingDays++;
                    break;
                case "Leave":
                    count_leave++;
                    workingDays++;
                    break;
                case "Holiday":
                    count_holiday++;
                    break;
                case "Off":
                    count_off++;
                    break;
            }
        }

        const pure_working = value.days - value.sunday_no;
        const total_assigned =
            count_present +
            count_late +
            count_half +
            count_leave +
            count_holiday +
            count_off;
        const absent = pure_working - total_assigned;
        const final_working = pure_working - count_holiday - count_off;

        attendanceSummary[month] = {
            month_days: value.days,
            sunday_no: value.sunday_no,
            working_days: workingDays,
            absent,
            count_present: count_present + count_late + count_half,
            count_late,
            half_day: count_half,
            count_leave,
            count_holiday,
            off: count_off,
            final_working,
        };
    }

    const attendanceTypes = await AttendanceFunctions.getAllTypes();

    const attendanceTypeMap = {};
    attendanceTypes.forEach((type) => {
        attendanceTypeMap[type.id] = {
            type: type.type,
            key_value: type.key_value,
        };
    });
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                attendanceSummary,
                attendanceTypeMap,
            },
            "Success"
        )
    );
});

export { getStudentAttendanceReport };
