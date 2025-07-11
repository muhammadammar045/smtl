import { sqlPool } from "../config/database.js";

const ParentFunctions = {
    async getStudentForParent(studentId, currentSessionId = 20) {
        const [rows] = await sqlPool.query(
            `SELECT 
                users.username AS std_username,
                users.password,
                students.official_address,
                students.noc,
                students.other_documents,
                students.clc_last_college,
                students.character_certificate,
                students.academic_info,
                students.award_info,
                students.know_about_college,
                students.fbise_number,
                students.emergency_medication,
                students.program_applied_for,
                student_session.transport_fees,
                students.vehroute_id,
                vehicle_routes.route_id,
                vehicle_routes.vehicle_id,
                transport_route.route_title,
                vehicles.vehicle_no,
                hostel_rooms.room_no,
                vehicles.driver_name,
                vehicles.driver_contact,
                hostel.id AS hostel_id,
                hostel.hostel_name,
                room_types.id AS room_type_id,
                room_types.room_type,
                students.hostel_room_id,
                student_session.id AS student_session_id,
                student_session.fees_discount,
                classes.playlist_id,
                classes.id AS class_id,
                classes.class,
                sections.id AS section_id,
                sections.section,
                students.id,
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
                students.note,
                students.religion,
                students.cast,
                school_houses.house_name,
                students.dob,
                students.birthofplace,
                students.def_status,
                students.current_address,
                students.previous_school,
                students.guardian_is,
                students.parent_id,
                students.student_cnic,
                students.nationality,
                students.smobno2,
                students.father_cnic,
                students.father_income,
                students.postal_address,
                students.residential_phone,
                students.last_exam_passed,
                students.exam_passing_year,
                students.obtained_marks,
                students.total_marks,
                students.name_of_board,
                students.board_roll_no,
                students.student_photograph,
                students.father_cnic_picture,
                students.student_cnic_picture,
                students.mark_sheet_picture,
                students.permanent_address,
                categories.category AS \`group\`,
                students.category_id,
                students.adhar_no,
                students.samagra_id,
                students.bank_account_no,
                students.bank_name,
                students.ifsc_code,
                students.guardian_name,
                students.father_pic,
                students.height,
                students.weight,
                students.measurement_date,
                students.mother_pic,
                students.guardian_pic,
                students.guardian_relation,
                students.guardian_phone,
                students.guardian_address,
                students.is_active,
                students.created_at,
                students.updated_at,
                students.father_name,
                students.father_phone,
                students.blood_group,
                students.school_house_id,
                students.father_occupation,
                students.mother_name,
                students.mother_phone,
                students.mother_occupation,
                students.guardian_occupation,
                students.gender,
                students.guardian_is,
                students.rte,
                students.guardian_email,
                students.unsuited,
                students.discount_fees,
                campus.id AS campus_main_id,
                campus.campus,
                students.last_attended_school,
                students.percentage_last_school
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
            LEFT JOIN users ON users.user_id = students.id
            WHERE students.id = ? AND student_session.session_id = ?
            LIMIT 1`,
            [studentId, currentSessionId]
        );

        return rows[0]; // Always return a single student
    },

    async getForParent(id = null, currentSession = null) {
        let baseQuery = `
        SELECT 
            users.username AS std_username,
            users.password,
            students.*,
            categories.category AS \`group\`,
            vehicle_routes.route_id,
            vehicle_routes.vehicle_id,
            transport_route.route_title,
            vehicles.vehicle_no,
            vehicles.driver_name,
            vehicles.driver_contact,
            hostel.id AS hostel_id,
            hostel.hostel_name,
            room_types.id AS room_type_id,
            room_types.room_type,
            hostel_rooms.room_no,
            student_session.transport_fees,
            student_session.fees_discount,
            student_session.id AS student_session_id,
            classes.id AS class_id,
            classes.playlist_id,
            classes.class,
            sections.id AS section_id,
            sections.section,
            school_houses.house_name,
            campus.id AS campus_main_id,
            campus.campus
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
        LEFT JOIN users ON users.user_id = students.id
    `;

        const conditions = [];
        const params = [];

        if (currentSession) {
            conditions.push("student_session.session_id = ?");
            params.push(currentSession);
        }

        if (id) {
            conditions.push("students.id = ?");
            params.push(id);
        } else {
            conditions.push("students.is_active = 'yes'");
        }

        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }

        if (!id) {
            baseQuery += " ORDER BY students.admission_no ASC";
        }

        const [rows] = await sqlPool.query(baseQuery, params);

        return rows[0];
    },

    async getParentInfo(username, password) {
        const [info] = await sqlPool.query(
            `SELECT users.*, students.*, students.father_pic, students.mother_pic, students.guardian_pic, students.guardian_relation 
         FROM users 
         JOIN students ON students.parent_id = users.id 
         WHERE users.username = ? AND users.password = ? 
         LIMIT 1`,
            [username, password]
        );
        return info[0];
    },

    async getSiblingsByParentId(parentId) {
        const [siblings] = await sqlPool.query(
            `SELECT id, firstname, lastname FROM students 
         WHERE parent_id = ? AND is_active = 'yes'`,
            [parentId]
        );
        return siblings;
    },
};

export default ParentFunctions;
