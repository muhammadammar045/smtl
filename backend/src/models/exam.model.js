// models/ExamModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const ExamModel = {
    // Get a specific exam or all exams
    get: async (id = null) => {
        let query = `
            SELECT exams.*, campus.campus
            FROM exams
            LEFT JOIN campus ON exams.campus_id = campus.id`;

        const params = [];

        if (id != null) {
            query += ` WHERE exams.id = ?`;
            params.push(id);
        } else {
            query += ` ORDER BY exams.id`;
        }

        const [rows] = await db.query(query, params);
        return id != null ? rows[0] : rows;
    },

    // Get exams by campus ID
    getCampus: async (campusId) => {
        const query = `
            SELECT exams.*, campus.campus
            FROM exams
            LEFT JOIN campus ON exams.campus_id = campus.id
            WHERE exams.campus_id = ?`;

        const [rows] = await db.query(query, [campusId]);
        return rows;
    },

    // Remove an exam by ID
    remove: async (id) => {
        const query = `DELETE FROM exams WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Add or update an exam
    add: async (data) => {
        if (data.id) {
            const query = `UPDATE exams SET ? WHERE id = ?`;
            await db.query(query, [data, data.id]);
        } else {
            const query = `INSERT INTO exams SET ?`;
            const [result] = await db.query(query, [data]);
            return result.insertId; // Return inserted ID
        }
    },

    // Add or update an exam schedule
    addExamSchedule: async (data) => {
        const queryCheck = `
            SELECT * FROM exam_schedules
            WHERE exam_id = ? AND teacher_subject_id = ?`;

        const [rows] = await db.query(queryCheck, [data.exam_id, data.teacher_subject_id]);

        if (rows.length > 0) {
            const queryUpdate = `UPDATE exam_schedules SET ? WHERE id = ?`;
            await db.query(queryUpdate, [data, rows[0].id]);
        } else {
            const queryInsert = `INSERT INTO exam_schedules SET ?`;
            await db.query(queryInsert, [data]);
        }

        // Delete the schedule if date_of_exam is null or empty
        if (!data.date_of_exam) {
            const queryDelete = `
                DELETE FROM exam_schedules
                WHERE exam_id = ? AND teacher_subject_id = ?`;
            await db.query(queryDelete, [data.exam_id, data.teacher_subject_id]);
        }
    }
};

export default ExamModel;
