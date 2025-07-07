import { sqlPool } from "../config/database.js";

const StudentFunctions = {
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

    async getStudentDocs(studentId) {
        const [rows] = await sqlPool.query(
            `SELECT * FROM student_doc WHERE student_id = ?`,
            [studentId]
        );
        return rows;
    },
};

export default StudentFunctions;
