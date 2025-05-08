// models/ClassHeadmasterModel.js

import { db } from "../db/conn.js";

const ClassHeadmasterModel = {
    getClassHeadmaster: async (id = null) => {
        if (id) {
            const [rows] = await db.query(
                `SELECT staff.*, class_headmaster.id AS ctid, class_headmaster.class_id, class_headmaster.section_id,
                classes.class, sections.section
         FROM class_headmaster
         JOIN staff ON class_headmaster.staff_id = staff.id
         JOIN classes ON class_headmaster.class_id = classes.id
         JOIN sections ON class_headmaster.section_id = sections.id
         WHERE class_headmaster.id = ?`,
                [id]
            );
            return rows[0] || null;
        } else {
            const [rows] = await db.query(
                `SELECT staff.*, class_headmaster.id AS ctid,
                classes.class, sections.section
         FROM class_headmaster
         JOIN staff ON class_headmaster.staff_id = staff.id
         JOIN classes ON class_headmaster.class_id = classes.id
         JOIN sections ON class_headmaster.section_id = sections.id`
            );
            return rows;
        }
    },

    addClassHeadmaster: async (data) => {
        if (data.id) {
            const id = data.id;
            delete data.id;
            const [result] = await db.query(`UPDATE class_headmaster SET ? WHERE id = ?`, [data, id]);
            return result;
        } else {
            const [result] = await db.query(`INSERT INTO class_headmaster SET ?`, [data]);
            return result;
        }
    },

    headmasterByClassSection: async (classId, sectionId) => {
        const [rows] = await db.query(
            `SELECT staff.*, class_headmaster.id AS ctid, class_headmaster.class_id, class_headmaster.section_id,
              classes.class, sections.section
       FROM class_headmaster
       JOIN staff ON class_headmaster.staff_id = staff.id
       JOIN classes ON class_headmaster.class_id = classes.id
       JOIN sections ON class_headmaster.section_id = sections.id
       WHERE class_headmaster.class_id = ? AND class_headmaster.section_id = ?`,
            [classId, sectionId]
        );
        return rows;
    },

    delete: async (classId, sectionId, staffIds = []) => {
        let query = `DELETE FROM class_headmaster WHERE class_id = ? AND section_id = ?`;
        const params = [classId, sectionId];

        if (staffIds.length > 0) {
            const placeholders = staffIds.map(() => '?').join(', ');
            query += ` AND staff_id IN (${placeholders})`;
            params.push(...staffIds);
        }

        const [result] = await db.query(query, params);
        return result;
    },

    getSubjectByHeadmaster: async (teacherId) => {
        const [rows] = await db.query(
            `SELECT classes.*, teacher_subjects.subject_id
       FROM teacher_subjects
       JOIN class_sections ON class_sections.id = teacher_subjects.class_section_id
       JOIN classes ON class_sections.class_id = classes.id
       WHERE teacher_subjects.teacher_id = ?
       GROUP BY class_sections.class_id`,
            [teacherId]
        );
        return rows;
    },
};

export default ClassHeadmasterModel;
