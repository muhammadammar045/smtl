import { sqlPool } from "../config/database.js";

const ExamScheduleFunctions = {
    async getExamByClassAndSection(classId, sectionId, campusId, sessionId) {
        try {
            const campusCondition = campusId
                ? `teacher_subjects.campus_id = ? AND`
                : "";

            const sql = `
   SELECT exams.*, exam_schedules.*, 
    exam_schedules.class_id AS teacherclass_id,
    exam_schedules.class_name,
    exam_schedules.section_id,
    exam_schedules.section_name
FROM exams
INNER JOIN (
    SELECT exam_schedules.*, 
        ts_with_meta.class_id,
        ts_with_meta.class_name,
        ts_with_meta.section_id,
        ts_with_meta.section_name
    FROM exam_schedules
    INNER JOIN (
        SELECT 
            teacher_subjects.id AS teacher_subject_id,
            teacher_subjects.class_section_id,
            teacher_subjects.subject_id,
            teacher_subjects.campus_id,
            teacher_subjects.session_id,
            classes.id AS class_id,
            classes.class AS class_name,
            sections.id AS section_id,
            sections.section AS section_name
        FROM class_sections
        INNER JOIN teacher_subjects 
            ON teacher_subjects.class_section_id = class_sections.id
        INNER JOIN classes 
            ON classes.id = class_sections.class_id
        INNER JOIN sections 
            ON sections.id = class_sections.section_id
        WHERE class_sections.class_id = ?
          AND class_sections.section_id = ?
          AND teacher_subjects.campus_id = ?
          AND teacher_subjects.session_id = ?
    ) AS ts_with_meta 
    ON ts_with_meta.teacher_subject_id = exam_schedules.teacher_subject_id
) AS exam_schedules ON exams.id = exam_schedules.exam_id
`;

            const params = campusId
                ? [classId, sectionId, campusId, sessionId]
                : [classId, sectionId, sessionId];

            const [results] = await sqlPool.query(sql, params);

            if (!results.length) return [];

            // Fetch exam_schedule_details for each result
            const enrichedResults = await Promise.all(
                results.map(async (exam) => {
                    const details =
                        await ExamScheduleFunctions.getDetailByClassAndSection(
                            exam.teacherclass_id,
                            exam.section_id,
                            exam.exam_id,
                            campusId
                        );
                    return {
                        ...exam,
                        exam_schedule_details: details,
                    };
                })
            );

            return enrichedResults;
        } catch (error) {
            console.error("Error in getExamByClassAndSection:", error.message);
            throw error;
        }
    },
    async getDetailByClassAndSection(
        classId,
        sectionId = null,
        examId,
        campusId,
        sessionId = null
    ) {
        try {
            const params = [];
            let sql = `
                SELECT 
                    staff.name AS staff_name, 
                    exam_schedules.*, 
                    exam_schedules.id AS exam_schedule_id,
                    subjects.sub_full_marks,
                    subjects.program_applied_for,
                    subjects.name,
                    subjects.id AS subject_id,
                    subjects.type
                FROM 
                    exam_schedules
                JOIN teacher_subjects ON exam_schedules.teacher_subject_id = teacher_subjects.id
                JOIN exams ON exam_schedules.exam_id = exams.id
                JOIN class_sections ON class_sections.id = teacher_subjects.class_section_id
                JOIN subjects ON teacher_subjects.subject_id = subjects.id
                JOIN staff ON teacher_subjects.teacher_id = staff.id
                WHERE 
                    class_sections.class_id = ?
                    AND teacher_subjects.campus_id = ?
                    AND exam_schedules.exam_id = ?
            `;

            params.push(classId, campusId, examId);

            if (sectionId) {
                sql += ` AND class_sections.section_id = ?`;
                params.push(sectionId);
            }

            if (sessionId) {
                sql += ` AND exam_schedules.session_id = ?`;
                params.push(sessionId);
            }

            const [results] = await sqlPool.query(sql, params);

            if (!results.length) return [];

            // Attach subject modules and marks
            const enrichedResults = await Promise.all(
                results.map(async (item) => {
                    const modules =
                        await ExamScheduleFunctions.getSubjectModulesWithMarks(
                            item.subject_id,
                            item.exam_schedule_id
                        );
                    return {
                        ...item,
                        sub_modules: modules,
                    };
                })
            );

            return enrichedResults;
        } catch (error) {
            console.error("Error in getDetailbyClsandSection:", error);
            throw error;
        }
    },

    async getSubjectModulesWithMarks(subjectId = null, examScheduleId = null) {
        try {
            let moduleSql = `SELECT * FROM sub_subjects`;
            const moduleParams = [];

            if (subjectId) {
                moduleSql += ` WHERE subject_id = ?`;
                moduleParams.push(subjectId);
            }

            const [modules] = await sqlPool.query(moduleSql, moduleParams);

            if (!modules.length) return [];

            const enrichedModules = await Promise.all(
                modules.map(async (mod) => {
                    const marksSql = `
                        SELECT * FROM exam_schedule_sub_subjects 
                        WHERE module_id = ?
                        ${examScheduleId ? "AND exam_schedule_id = ?" : ""}
                    `;
                    const marksParams = examScheduleId
                        ? [mod.id, examScheduleId]
                        : [mod.id];

                    const [marksRow] = await sqlPool.query(
                        marksSql,
                        marksParams
                    );
                    const marksData = marksRow[0] || {};

                    return {
                        ...mod,
                        full_marks: marksData.full_marks || null,
                        passing_marks: marksData.passing_marks || null,
                    };
                })
            );

            return enrichedModules;
        } catch (error) {
            console.error("Error in getSubjectModulesWithMarks:", error);
            throw error;
        }
    },
};

export default ExamScheduleFunctions;
