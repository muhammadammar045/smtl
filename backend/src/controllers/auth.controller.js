import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sqlPool } from "../config/database.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // 1. Find user
    const [userRows] = await sqlPool.query(
        `SELECT id, username, password, role, is_active, def_status 
         FROM users WHERE username LIKE ? AND password = ? LIMIT 1`,
        [`%${username}%`, password]
    );

    if (!userRows.length) {
        throw new ApiError(401, "Invalid Username or Password");
    }

    const user = userRows[0];

    if (user.is_active !== "yes" || user.def_status !== "enable") {
        throw new ApiError(
            403,
            "Your account is disabled. Please contact administrator."
        );
    }

    const role = user.role;
    let userInfo = [];

    // 2. Load profile info
    if (role === "student") {
        const [info] = await sqlPool.query(
            `SELECT users.*, students.firstname, students.lastname, students.image, students.guardian_name 
             FROM users 
             JOIN students ON students.id = users.user_id 
             WHERE users.id = ? AND students.is_active = 'yes' 
             LIMIT 1`,
            [user.id]
        );
        userInfo = info;
    } else if (role === "parent") {
        const [info] = await sqlPool.query(
            `SELECT users.*, students.*, students.father_pic, students.mother_pic, students.guardian_pic, students.guardian_relation 
             FROM users 
             JOIN students ON students.parent_id = users.id 
             WHERE users.username = ? AND users.password = ? 
             LIMIT 1`,
            [username, password]
        );
        userInfo = info;
    }

    if (!userInfo.length) {
        throw new ApiError(403, "Account suspended or student not active");
    }

    const result = userInfo[0];

    // 3. Load school settings
    const [settingsRows] = await sqlPool.query(`
        SELECT 
            sch_settings.branch_code, sch_settings.branch_name, sch_settings.passing_percentage,
            sch_settings.num_subject_fail, sch_settings.school_city, sch_settings.start_of_session,
            sch_settings.result_template, sch_settings.due_school_fine, sch_settings.due_school_days,
            sch_settings.signature, sch_settings.attendance_num, sch_settings.id, sch_settings.campus_id,
            sch_settings.lang_id, sch_settings.class_teacher, sch_settings.is_rtl, sch_settings.cron_secret_key,
            sch_settings.timezone, sch_settings.name, sch_settings.email, sch_settings.phone,
            languages.language, sch_settings.parent_signature, sch_settings.principal_signature,
            sch_settings.address, sch_settings.dise_code, sch_settings.fee_system, sch_settings.discipline1,
            sch_settings.bank_account_1, sch_settings.bank_account_1_name, sch_settings.bank_account_1_title,
            sch_settings.bank_account_2, sch_settings.bank_account_2_name, sch_settings.bank_account_2_title,
            sch_settings.online_admission, sch_settings.discipline2, sch_settings.start_month_session,
            sch_settings.end_month_session, sch_settings.date_format, sch_settings.autogen_number,
            sch_settings.addmission_prefix_number, sch_settings.addmission_prefix, sch_settings.currency,
            sch_settings.currency_symbol, sch_settings.start_month, sch_settings.session_id, sch_settings.fee_due_days,
            sch_settings.image, sch_settings.theme, sessions.session
        FROM sch_settings
        JOIN sessions ON sessions.id = sch_settings.session_id
        JOIN languages ON languages.id = sch_settings.lang_id
        ORDER BY sch_settings.id
        LIMIT 1
    `);

    if (!settingsRows.length) {
        throw new ApiError(500, "System settings not found");
    }

    const setting = settingsRows[0];

    // 4. Construct session data
    let responseData = {};

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
                sch_name: setting.name,
                language: {
                    lang_id: setting.lang_id,
                    language: setting.language,
                },
                is_rtl: setting.is_rtl,
                theme: setting.theme,
            },
        };
    } else if (role === "parent") {
        const [siblings] = await sqlPool.query(
            `SELECT *
             FROM students 
             WHERE parent_id = ? AND is_active = 'yes'`,
            [result.id]
        );

        const childStudent = siblings.map((s) => ({
            student_id: s.id,
            name: `${s.firstname} ${s.lastname}`,
        }));

        responseData.parent = {
            id: result.id,
            student_id: result.user_id,
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
    }

    // 5. Final response
    res.json(new ApiResponse(200, responseData, "Login successful"));
});

export { login };
