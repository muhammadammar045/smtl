import { sqlPool } from "../config/database.js";

const StudentFunctions = {
    async findUserByUsernameAndPassword(username, password) {
        const [rows] = await sqlPool.query(
            `SELECT id, username, password, role, is_active, def_status 
         FROM users WHERE username LIKE ? AND password = ? LIMIT 1`,
            [`%${username}%`, password]
        );
        return rows[0];
    },

    async getStudentInfo(userId) {
        const [info] = await sqlPool.query(
            `SELECT users.*, students.firstname, students.lastname, students.image, students.guardian_name 
            FROM users 
            JOIN students ON students.id = users.user_id 
            WHERE users.id = ? AND students.is_active = 'yes' 
            LIMIT 1`,
            [userId]
        );
        return info[0];
    },

    async getStudentById(studentId) {
        const [rows] = await sqlPool.query(
            `SELECT 
            students.*, 
            student_session.*, 
            classes.*, 
            sections.*, 
            hostel_rooms.room_no, 
            hostel.id as hostel_id, 
            hostel.hostel_name,
            room_types.id as room_type_id, 
            room_types.room_type, 
            vehicle_routes.route_id, 
            vehicle_routes.vehicle_id, 
            transport_route.route_title, 
            vehicles.vehicle_no, 
            vehicles.driver_name, 
            vehicles.driver_contact, 
            school_houses.house_name, 
            campus.id as campus_main_id, 
            campus.campus, 
            categories.category as \`group\`, 
            categories.id as category_id
        FROM students
        JOIN student_session ON student_session.student_id = students.id
        JOIN classes ON student_session.class_id = classes.id
        JOIN sections ON sections.id = student_session.section_id
        LEFT JOIN hostel_rooms ON hostel_rooms.id = students.hostel_room_id
        LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
        LEFT JOIN room_types ON room_types.id = hostel_rooms.room_type_id
        LEFT JOIN vehicle_routes ON vehicle_routes.id = students.vehroute_id
        LEFT JOIN transport_route ON vehicle_routes.route_id = transport_route.id
        LEFT JOIN vehicles ON vehicles.id = vehicle_routes.vehicle_id
        LEFT JOIN school_houses ON school_houses.id = students.school_house_id
        JOIN campus ON campus.id = student_session.campus_id
        LEFT JOIN categories ON students.program_applied_for = categories.id
        WHERE students.id = ? AND student_session.session_id = (
            SELECT session_id FROM sch_settings WHERE campus_id = campus.id LIMIT 1
        )
        LIMIT 1`,
            [studentId]
        );
        return rows[0];
    },

    async getStudentByIdInAttendance(id = null, currentSession) {
        const params = [];
        let query = `
            SELECT 
                student_session.id as student_session_id,
                student_session.fees_discount,
                student_session.transport_fees,
                students.*,
                classes.playlist_id,
                classes.id AS class_id,
                classes.class,
                sections.id AS section_id,
                sections.section,
                campus.id as campus_main_id,
                campus.campus,
                categories.category as \`group\`,
                school_houses.house_name,
                hostel_rooms.room_no,
                hostel.id as hostel_id,
                hostel.hostel_name,
                room_types.id as room_type_id,
                room_types.room_type,
                vehicle_routes.route_id,
                vehicle_routes.vehicle_id,
                transport_route.route_title,
                vehicles.vehicle_no,
                vehicles.driver_name,
                vehicles.driver_contact
            FROM students
            JOIN student_session ON student_session.student_id = students.id
            JOIN classes ON student_session.class_id = classes.id
            JOIN sections ON student_session.section_id = sections.id
            JOIN campus ON student_session.campus_id = campus.id
            LEFT JOIN hostel_rooms ON students.hostel_room_id = hostel_rooms.id
            LEFT JOIN hostel ON hostel.id = hostel_rooms.hostel_id
            LEFT JOIN room_types ON room_types.id = hostel_rooms.room_type_id
            LEFT JOIN vehicle_routes ON vehicle_routes.id = students.vehroute_id
            LEFT JOIN transport_route ON transport_route.id = vehicle_routes.route_id
            LEFT JOIN vehicles ON vehicles.id = vehicle_routes.vehicle_id
            LEFT JOIN school_houses ON school_houses.id = students.school_house_id
            LEFT JOIN categories ON students.program_applied_for = categories.id
            WHERE student_session.session_id = ?
        `;

        params.push(currentSession);

        if (id) {
            query += ` AND students.id = ?`;
            params.push(id);
        } else {
            query += ` AND students.is_active = 'yes' ORDER BY students.admission_no ASC`;
        }

        const [rows] = await sqlPool.execute(query, params);
        return id ? rows[0] || null : rows;
    },

    async getCurrentSession2(campusId) {
        const [rows] = await sqlPool.query(
            `SELECT session_id FROM sch_settings WHERE campus_id = ? ORDER BY id LIMIT 1`,
            [campusId]
        );
        return rows.length ? rows[0].session_id : null;
    },

    async getStudentDocs(studentId) {
        const [rows] = await sqlPool.query(
            `SELECT * FROM student_doc WHERE student_id = ?`,
            [studentId]
        );
        return rows;
    },

    async getRecentRecord(id = null, currentSession) {
        const limit = 5;

        const baseQuery = `
            SELECT 
                classes.id AS class_id,
                classes.class,
                classes.playlist_id,
                sections.id AS section_id,
                sections.section,
                students.id,
                student_session.campus_id,
                students.admission_no,
                students.program_applied_for,
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
                students.category_id,
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
                students.father_phone,
                students.father_occupation,
                students.mother_name,
                students.mother_phone,
                students.mother_occupation,
                students.guardian_occupation,
                students.gender,
                students.guardian_is
            FROM students
            JOIN student_session ON student_session.student_id = students.id
            JOIN classes ON student_session.class_id = classes.id
            JOIN sections ON sections.id = student_session.section_id
            WHERE student_session.session_id = ?
            ${id ? "AND students.id = ?" : ""}
            ORDER BY students.admission_no ASC
            LIMIT ?
        `;

        try {
            const params = id
                ? [currentSession, id, limit]
                : [currentSession, limit];

            const [rows] = await sqlPool.query(baseQuery, params);

            return id ? rows[0] : rows;
        } catch (err) {
            console.error("Error fetching recent student records:", err);
            throw err;
        }
    },
};

export default StudentFunctions;
