// models/ClassModel.js

import { db } from "../db/conn.js";

const ClassModel = {
    getClassByCampus: async (campus_id) => {
        const [rows] = await db.query(
            `SELECT * FROM classes WHERE campus_id = ? ORDER BY order_priority`,
            [campus_id]
        );
        return rows;
    },

    getAll: async (id = null) => {
        if (id) {
            const [rows] = await db.query(`SELECT * FROM classes WHERE id = ?`, [id]);
            return rows[0];
        } else {
            const [rows] = await db.query(`SELECT * FROM classes ORDER BY id`);
            return rows;
        }
    },

    getClassTeacherByclass: async (classId, sectionId) => {
        const [rows] = await db.query(
            `SELECT staff.*, class_teacher.id as ctid, classes.class, classes.id as class_id,
              sections.id as section_id, sections.section
       FROM class_teacher
       JOIN staff ON class_teacher.staff_id = staff.id
       JOIN classes ON class_teacher.class_id = classes.id
       JOIN sections ON class_teacher.section_id = sections.id
       WHERE class_teacher.class_id = ? AND class_teacher.section_id = ?`,
            [classId, sectionId]
        );
        return rows;
    },

    getClassHeadmaster: async () => {
        const [rows] = await db.query(
            `SELECT staff.*, class_headmaster.id as ctid, classes.class, classes.id as class_id,
              sections.id as section_id, sections.section,
              campus.campus, campus.id as camp_id
       FROM class_headmaster
       JOIN staff ON class_headmaster.staff_id = staff.id
       JOIN classes ON class_headmaster.class_id = classes.id
       JOIN sections ON class_headmaster.section_id = sections.id
       JOIN campus ON class_headmaster.campus_id = campus.id
       GROUP BY class_headmaster.class_id, class_headmaster.section_id`
        );
        return rows;
    },

    checkClassHeadmasterStatus: async (staffId) => {
        const [rows] = await db.query(
            `SELECT * FROM class_headmaster WHERE staff_id = ?`,
            [staffId]
        );
        return rows.length > 0 ? rows[0] : false;
    },

    checkClassHeadmasterExists: async (classId, sectionId) => {
        const [rows] = await db.query(
            `SELECT * FROM class_headmaster WHERE class_id = ? AND section_id = ?`,
            [classId, sectionId]
        );
        return rows.length > 0 ? rows[0] : false;
    },

    getProgram: async () => {
        const [rows] = await db.query(`SELECT * FROM categories`);
        return rows;
    },

    remove: async (id) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query(`DELETE FROM classes WHERE id = ?`, [id]);
            await conn.query(`DELETE FROM class_sections WHERE class_id = ?`, [id]);
            await conn.commit();
            return true;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    add: async (data) => {
        if (data.id) {
            const id = data.id;
            delete data.id;
            await db.query(`UPDATE classes SET ? WHERE id = ?`, [data, id]);
        } else {
            await db.query(`INSERT INTO classes SET ?`, [data]);
        }
    },

    checkDataExists: async (className) => {
        const [rows] = await db.query(`SELECT * FROM classes WHERE class = ?`, [className]);
        return rows.length > 0 ? rows[0] : false;
    },

    checkClassTeacherExists: async (classId, sectionId, teacherIds) => {
        const placeholders = teacherIds.map(() => '?').join(',');
        const [rows] = await db.query(
            `SELECT * FROM class_teacher WHERE class_id = ? AND section_id = ? AND staff_id IN (${placeholders})`,
            [classId, sectionId, ...teacherIds]
        );
        return rows.length > 0 ? rows[0] : false;
    },

    getClassTeacher: async () => {
        const [rows] = await db.query(
            `SELECT staff.*, campus.campus, class_teacher.campus_id,
              class_teacher.id as ctid, classes.class, classes.id as class_id,
              sections.id as section_id, sections.section
       FROM class_teacher
       JOIN staff ON class_teacher.staff_id = staff.id
       JOIN campus ON class_teacher.campus_id = campus.id
       JOIN classes ON class_teacher.class_id = classes.id
       JOIN sections ON class_teacher.section_id = sections.id
       GROUP BY class_teacher.class_id, class_teacher.section_id
       ORDER BY class_teacher.timestamp DESC`
        );
        return rows;
    },
};

export default ClassModel;
