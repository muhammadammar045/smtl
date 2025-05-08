// models/ConferenceHistoryModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const ConferenceHistoryModel = {
    getSessionData: async () => {
        const parentCheck = await db.query("SELECT * FROM users WHERE role = 'parent'"); // Adjust based on actual logic for user data
        let userData;

        if (parentCheck.role === "parent") {
            const recordNum = end(getUriSegments()); // Adjust based on your URI segment logic
            userData = await db.query("SELECT * FROM users WHERE id = ?", [recordNum]);
        } else {
            userData = await db.query("SELECT * FROM users WHERE id = ?", [parentCheck.id]);
        }

        const campusId = userData.student_session_id ? userData.campus_main_id : userData.campus_ids;
        const selectedCampus = userData.student_session_id ? campusId : getCookie("cookie_selected_campus");
        const campusIds = campusId.split(",");

        const totalSession = {};
        const campusIdz = {};

        for (const campId of campusIds) {
            const sessionId = await db.query("SELECT session_id FROM settings WHERE campus_id = ?", [campId]);
            totalSession[campId] = sessionId;
            campusIdz[campId] = campId;
        }

        return totalSession;
    },

    getCampusData: async () => {
        const parentCheck = await db.query("SELECT * FROM users WHERE role = 'parent'"); // Adjust based on actual logic for user data
        let userData;

        if (parentCheck.role === "parent") {
            const recordNum = end(getUriSegments()); // Adjust based on your URI segment logic
            userData = await db.query("SELECT * FROM users WHERE id = ?", [recordNum]);
        } else {
            userData = await db.query("SELECT * FROM users WHERE id = ?", [parentCheck.id]);
        }

        const campusId = userData.campus_ids;
        const selectedCampus = getCookie("cookie_selected_campus");
        const campusIds = campusId.split(",");

        const campusIdz = {};

        for (const campId of campusIds) {
            const sessionId = await db.query("SELECT session_id FROM settings WHERE campus_id = ?", [campId]);
            campusIdz[campId] = campId;
        }

        return campusIdz;
    },

    updateHistory: async (data, type) => {
        const currentDate = new Date().toISOString().split('T')[0];

        let query = "SELECT * FROM conferences_history WHERE conference_id = ? AND attendance_date = ?";
        const params = [data.conference_id, currentDate];

        if (type === "student") {
            query += " AND student_id = ?";
            params.push(data.student_id);
        } else if (type === "staff") {
            query += " AND staff_id = ?";
            params.push(data.staff_id);
        }

        const [rows] = await db.query(query, params);

        if (rows.length > 0) {
            const row = rows[0];
            data.total_hit = row.total_hit + 1;
            await db.query("UPDATE conferences_history SET ? WHERE id = ?", [data, row.id]);
        } else {
            await db.query("INSERT INTO conferences_history SET ?", [data]);
        }

        return true;
    },

    getMeeting: async () => {
        const query = `
            SELECT conferences.*, 
                (SELECT COUNT(*) FROM conferences_history WHERE conferences_history.conference_id = conferences.id) AS total_viewers,
                create_by.name AS create_by_name, 
                create_by.surname AS create_by_surname
            FROM conferences 
            JOIN staff AS create_by ON create_by.id = conferences.created_id
            WHERE purpose = 'meeting' AND status = 2
            ORDER BY DATE(conferences.date) DESC, conferences.date ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    getClass: async (classId, sectionId, date) => {
        const totalSession = await ConferenceHistoryModel.getSessionData();
        const campusIdz = await ConferenceHistoryModel.getCampusData();

        const query = `
            SELECT conferences.*, classes.class AS class_name, sections.section AS section_name,
                create_by.employee_id AS create_bystaffid, for_create.employee_id AS for_creatstaffid,
                (SELECT COUNT(*) FROM conferences_history WHERE conferences_history.conference_id = conferences.id AND conferences_history.attendance_date = ?) AS total_viewers,
                create_by.name AS create_by_name, create_by.surname AS create_by_surname, 
                for_create.name AS for_create_name, for_create.surname AS for_create_surname,
                roles.name AS create_by_role_name, for_create_role.name AS create_for_role_name
            FROM conferences
            LEFT JOIN conferences_history ON conferences.id = conferences_history.conference_id
            JOIN staff AS create_by ON create_by.id = conferences.created_id
            JOIN staff AS for_create ON for_create.id = conferences.staff_id
            JOIN classes ON classes.id = conferences.class_id
            LEFT JOIN sections ON sections.id = conferences.section_id
            INNER JOIN staff_roles ON staff_roles.staff_id = conferences.created_id
            INNER JOIN roles ON roles.id = staff_roles.role_id
            INNER JOIN staff_roles AS for_create_staff_role ON for_create_staff_role.staff_id = conferences.staff_id
            INNER JOIN roles AS for_create_role ON for_create_role.id = for_create_staff_role.role_id
            WHERE purpose = 'class'
            AND conferences.class_id = ?
            AND conferences.session_id = ?
            AND conferences_history.attendance_date = ?
            GROUP BY conferences_history.conference_id
            ORDER BY conferences.id DESC
        `;

        const [rows] = await db.query(query, [date, classId, sectionId, totalSession.current_session, date]);
        return rows;
    },

    getClassStaff: async (classId, sectionId, staffId, date) => {
        const totalSession = await ConferenceHistoryModel.getSessionData();
        const campusIdz = await ConferenceHistoryModel.getCampusData();

        const query = `
            SELECT campus.campus, conferences.*, classes.class AS class_name, sections.section AS section_name, 
                create_by.employee_id AS create_bystaffid, for_create.employee_id AS for_creatstaffid,
                (SELECT COUNT(*) FROM conferences_history WHERE conferences_history.conference_id = conferences.id) AS total_viewers,
                create_by.name AS create_by_name, create_by.surname AS create_by_surname,
                for_create.name AS for_create_name, for_create.surname AS for_create_surname,
                roles.name AS create_by_role_name, for_create_role.name AS create_for_role_name
            FROM conferences 
            JOIN staff AS create_by ON create_by.id = conferences.created_id 
            JOIN staff AS for_create ON for_create.id = conferences.staff_id 
            JOIN classes ON classes.id = conferences.class_id 
            JOIN sections ON sections.id = conferences.section_id 
            INNER JOIN staff_roles ON staff_roles.staff_id = conferences.created_id
            INNER JOIN roles ON roles.id = staff_roles.role_id
            INNER JOIN staff_roles AS for_create_staff_role ON for_create_staff_role.staff_id = conferences.staff_id 
            INNER JOIN roles AS for_create_role ON for_create_role.id = for_create_staff_role.role_id 
            INNER JOIN campus ON conferences.campus_id = campus.id
            WHERE purpose = 'class' 
            AND conferences.class_id = ?
            AND conferences.staff_id = ?
            AND conferences.session_id = ?
            GROUP BY conferences.id
            ORDER BY conferences.id DESC
        `;

        const [rows] = await db.query(query, [classId, staffId, totalSession.current_session]);
        return rows;
    },

    getMeetingStaff: async (conferenceId) => {
        const query = `
            SELECT conferences_history.*, for_create.name AS create_for_name, for_create.surname AS create_for_surname, 
                roles.name AS role_name, for_create.employee_id
            FROM conferences_history
            JOIN staff AS for_create ON for_create.id = conferences_history.staff_id
            JOIN staff_roles ON staff_roles.id = for_create.id
            JOIN roles ON roles.id = staff_roles.role_id
            WHERE conference_id = ?
            ORDER BY conferences_history.id
        `;
        const [rows] = await db.query(query, [conferenceId]);
        return rows;
    },

    getLiveStudent: async (conferenceId, requiredDate) => {
        const query = `
            SELECT conferences_history.*, students.admission_no, students.roll_no, students.admission_date, students.firstname, 
                students.lastname, students.image, students.mobileno, students.email, students.father_name
            FROM conferences_history
            JOIN students ON students.id = conferences_history.student_id
            WHERE conference_id = ? AND conferences_history.attendance_date = ?
            ORDER BY conferences_history.id
        `;
        const [rows] = await db.query(query, [conferenceId, requiredDate]);
        return rows;
    },

    zoomAttendance: async (conference, campusId, classId, date) => {
        const query = `
            SELECT conferences.subject AS subject_id, conferences.title, conferences_history.*, students.firstname, 
                students.id AS student_id, students.roll_no, students.admission_no, students.lastname, 
                student_session.id AS student_session_id
            FROM students
            LEFT JOIN student_session ON student_session.student_id = students.id 
            LEFT JOIN conferences_history ON conferences_history.student_id = student_session.student_id 
                AND conferences_history.attendance_date = ? 
                AND conferences_history.conference_id = ?
            LEFT JOIN conferences ON conferences.id = conferences_history.conference_id
            WHERE student_session.student_id = students.id 
                AND students.is_active = 'yes' 
                AND student_session.campus_id = ? 
                AND student_session.class_id = ?
                AND student_session.session_id = ?
            GROUP BY conferences_history.student_id
        `;
        const [rows] = await db.query(query, [date, conference, campusId, classId, this.current_session]);
        return rows;
    },

    checkStudent: async (conferenceId, studentId, date) => {
        const query = `
            SELECT conferences_history.* 
            FROM conferences_history 
            WHERE conferences_history.conference_id = ? 
                AND conferences_history.student_id = ? 
                AND conferences_history.attendance_date = ?
            GROUP BY conferences_history.student_id
        `;
        const [rows] = await db.query(query, [conferenceId, studentId, date]);
        return rows;
    },

    insertAttendance: async (data) => {
        await db.query("INSERT INTO conferences_history SET ?", [data]);
        return true;
    },

    insertStatusConference: async (data) => {
        await db.query("INSERT INTO conferences_status SET ?", [data]);
        return true;
    },

    updateAttendance: async (data, conferenceId, studentId, date) => {
        await db.query("UPDATE conferences_history SET ? WHERE conference_id = ? AND student_id = ? AND attendance_date = ?", [data, conferenceId, studentId, date]);
        return true;
    }
};

export default ConferenceHistoryModel;
