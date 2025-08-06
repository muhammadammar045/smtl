import { sqlPool } from "../config/database.js";

const LiveClassesFunctions = {
    async getById(conferenceId) {
        const sql = `
        SELECT c.*, fc.name AS create_for_name, fc.surname AS create_for_surname,
               cb.name AS create_by_name, cb.surname AS create_by_surname,
               cl.class, s.section
        FROM conferences c
        LEFT JOIN staff fc ON fc.id = c.staff_id
        JOIN staff cb ON cb.id = c.created_id
        LEFT JOIN classes cl ON cl.id = c.class_id
        LEFT JOIN sections s ON s.id = c.section_id
        WHERE c.id = ?
    `;
        const [rows] = await sqlPool.query(sql, [conferenceId]);
        return rows[0];
    },
    async getByClassSection(
        classId,
        sectionId,
        campusId,
        programAppliedFor,
        sessionId
    ) {
        const sql = `
        SELECT c.*, cs.*, cl.class, s.section,
               fc.name as create_for_name,
               fc.surname as create_for_surname,
               fc.employee_id as for_create_employee_id,
               r.name as for_create_role_name
        FROM conferences c
        LEFT JOIN conferences_status cs ON cs.conference_id = c.id AND cs.conference_date = CURDATE()
        JOIN classes cl ON cl.id = c.class_id
        JOIN sections s ON s.id = c.section_id
        JOIN staff fc ON fc.id = c.staff_id
        JOIN staff_roles sr ON sr.staff_id = fc.id
        JOIN roles r ON r.id = sr.role_id
        WHERE c.class_id = ?
          AND c.campus_id = ?
          AND c.session_id = ?
          AND (c.program_applied_for = ? OR c.program_applied_for = 1)
        ORDER BY ordertime ASC
    `;
        const [rows] = await sqlPool.query(sql, [
            classId,
            campusId,
            sessionId,
            programAppliedFor,
        ]);
        return rows;
    },
};

export default LiveClassesFunctions;
