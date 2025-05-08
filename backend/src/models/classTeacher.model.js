// models/ClassTeacherModel.js

import { db } from "../db/conn.js";

const ClassTeacherModel = {
    getClassTeacher: async (id = null) => {
        const query = `
      SELECT staff.*, class_teacher.id AS ctid, class_teacher.class_id, class_teacher.section_id,
             classes.class, sections.section
      FROM class_teacher
      JOIN staff ON class_teacher.staff_id = staff.id
      JOIN classes ON class_teacher.class_id = classes.id
      JOIN sections ON class_teacher.section_id = sections.id
      ${id ? "WHERE class_teacher.id = ?" : ""}
    `;
        const [rows] = await db.query(query, id ? [id] : []);
        return id ? rows[0] || null : rows;
    },

    addClassTeacher: async (data) => {
        if (data.id) {
            const id = data.id;
            delete data.id;
            await db.query(`UPDATE class_teacher SET ? WHERE id = ?`, [data, id]);
        } else {
            await db.query(`INSERT INTO class_teacher SET ?`, [data]);
        }
    },

    teacherByClassSection: async (classId, sectionId) => {
        const [rows] = await db.query(
            `SELECT staff.*, class_teacher.id AS ctid, class_teacher.class_id, class_teacher.section_id,
              classes.class, sections.section
       FROM class_teacher
       JOIN staff ON class_teacher.staff_id = staff.id
       JOIN classes ON class_teacher.class_id = classes.id
       JOIN sections ON class_teacher.section_id = sections.id
       WHERE class_teacher.class_id = ? AND class_teacher.section_id = ?`,
            [classId, sectionId]
        );
        return rows;
    },

    getClassByUser: async (staffId) => {
        const [rows] = await db.query(
            `SELECT classes.*
       FROM class_teacher
       JOIN classes ON class_teacher.class_id = classes.id
       WHERE class_teacher.staff_id = ?
       GROUP BY class_teacher.class_id`,
            [staffId]
        );
        return rows;
    },

    classBySubjectTeacher: async (teacherId, excludedClasses = []) => {
        const placeholders = excludedClasses.map(() => "?").join(", ");
        const [rows] = await db.query(
            `SELECT classes.*, teacher_subjects.subject_id
       FROM teacher_subjects
       JOIN class_sections ON class_sections.id = teacher_subjects.class_section_id
       JOIN classes ON class_sections.class_id = classes.id
       WHERE teacher_subjects.teacher_id = ?
       ${excludedClasses.length ? `AND class_sections.class_id NOT IN (${placeholders})` : ""}
       GROUP BY class_sections.class_id`,
            excludedClasses.length ? [teacherId, ...excludedClasses] : [teacherId]
        );
        return rows;
    },

    delete: async (classId, sectionId, staffArray = []) => {
        let query = `DELETE FROM class_teacher WHERE class_id = ? AND section_id = ?`;
        const params = [classId, sectionId];

        if (staffArray.length > 0) {
            const placeholders = staffArray.map(() => "?").join(", ");
            query += ` AND staff_id IN (${placeholders})`;
            params.push(...staffArray);
        }

        await db.query(query, params);
    },

    getSubjectByTeacher: async (teacherId) => {
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

    getSubjectByTeacherByCampus: async (teacherId, campusId) => {
        const [rows] = await db.query(
            `SELECT classes.*, teacher_subjects.subject_id
       FROM teacher_subjects
       JOIN class_sections ON class_sections.id = teacher_subjects.class_section_id
       JOIN classes ON class_sections.class_id = classes.id
       WHERE teacher_subjects.teacher_id = ? AND teacher_subjects.campus_id = ?
       GROUP BY class_sections.class_id`,
            [teacherId, campusId]
        );
        return rows;
    },
};

export default ClassTeacherModel;
