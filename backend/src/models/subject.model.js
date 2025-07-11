import { sqlPool } from "../config/database.js";

const SubjectFunctions = {
    async getSubjectByClassSectionAndGroup(
        classId,
        sectionId,
        programAppliedFor,
        currentSession
    ) {
        if (!classId || !sectionId || !programAppliedFor || !currentSession) {
            throw new Error("Missing required filters");
        }

        const query = `
            SELECT 
                subjects.id AS subject_id,
                subjects.name AS subject_name,
                subjects.type,
                subjects.code,
                GROUP_CONCAT(DISTINCT staff.name, ' ', staff.surname) AS teachers
            FROM teacher_subjects
            INNER JOIN subjects ON teacher_subjects.subject_id = subjects.id 
            INNER JOIN class_sections ON teacher_subjects.class_section_id = class_sections.id 
            INNER JOIN staff ON staff.id = teacher_subjects.teacher_id  
            WHERE 
                class_sections.class_id = ?
                AND class_sections.section_id = ?
                AND teacher_subjects.session_id = ?
                AND FIND_IN_SET(?, subjects.program_applied_for)
            GROUP BY subjects.id, subjects.name, subjects.type, subjects.code
        `;

        try {
            const [rows] = await sqlPool.query(query, [
                classId,
                sectionId,
                currentSession,
                programAppliedFor,
            ]);
            return rows;
        } catch (error) {
            console.error("Error in getSubjectByClassSectionAndGroup:", error);
            throw error;
        }
    },
};

export default SubjectFunctions;
