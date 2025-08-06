import { sqlPool } from "../config/database.js";

const AttendanceFunctions = {
    async searchByStudentId(studentId, currentSessionId) {
        try {
            const sql = `
      SELECT 
        campus.id AS campus_id,
        campus.campus,
        classes.id AS class_id,
        student_session.id AS student_session_id,
        students.id,
        classes.class,
        sections.id AS section_id,
        sections.section,
        students.admission_no,
        students.roll_no,
        students.admission_date,
        students.firstname,
        students.lastname,
        students.image,
        students.mobileno,
        students.email,
        students.state,
        students.city,
        students.pincode,
        students.religion,
        students.dob,
        students.birthofplace,
        students.current_address,
        students.permanent_address,
        IFNULL(students.category_id, 0) AS category_id,
        IFNULL(categories.category, '') AS category,
        students.adhar_no,
        students.samagra_id,
        students.bank_account_no,
        students.bank_name,
        students.ifsc_code,
        students.guardian_name,
        students.guardian_relation,
        students.guardian_phone,
        students.guardian_address,
        students.is_active,
        students.created_at,
        students.updated_at,
        students.father_name,
        students.rte,
        students.gender,
        users.id AS user_tbl_id,
        users.username,
        users.password AS user_tbl_password,
        users.is_active AS user_tbl_active
      FROM students
      INNER JOIN student_session ON student_session.student_id = students.id
      INNER JOIN campus ON student_session.campus_id = campus.id
      INNER JOIN classes ON student_session.class_id = classes.id
      INNER JOIN sections ON student_session.section_id = sections.id
      LEFT JOIN categories ON students.program_applied_for = categories.id
      LEFT JOIN users ON users.user_id = students.id
      WHERE student_session.session_id = ?
        AND students.is_active = 'yes'
        AND users.role = 'student'
        ${studentId ? "AND students.admission_no = ?" : ""}
    `;

            const params = studentId
                ? [currentSessionId, studentId]
                : [currentSessionId];

            const [rows] = await pool.execute(sql, params);

            return rows;
        } catch (err) {
            console.error("Error fetching student info:", err);
            throw err;
        }
    },

    async getAllTypes(id = null) {
        let query = `SELECT * FROM attendence_type`;
        const params = [];

        if (id) {
            query += ` WHERE id = ?`;
            params.push(id);
        } else {
            query += ` ORDER BY id`;
        }

        const [rows] = await sqlPool.execute(query, params);

        return id ? rows[0] || null : rows;
    },

    async searchAttendanceReportByStudentId(studentId, startDate, endDate) {
        const query = `
        SELECT 
            bio_users_logs.*, 
            attendence_type.type, 
            attendence_type.key_value
        FROM bio_users_logs
        INNER JOIN bio_users ON bio_users_logs.card_uid = bio_users.card_uid
        INNER JOIN attendence_type ON bio_users_logs.staff_attendance_type_id = attendence_type.id
        WHERE bio_users.std_id = ?
          AND bio_users_logs.checkindate >= ?
          AND bio_users_logs.checkindate <= ?
        ORDER BY bio_users_logs.checkindate ASC
    `;

        const [rows] = await sqlPool.execute(query, [
            studentId,
            startDate,
            endDate,
        ]);
        return rows;
    },
};

export default AttendanceFunctions;
