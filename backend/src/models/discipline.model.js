// models/DisciplineModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const DisciplineModel = {
    // Fetches discipline records based on ID or fetches all records if no ID is provided
    get: async (id = null) => {
        let query = `SELECT * FROM discipline`;
        if (id !== null) {
            query += ` WHERE id = ?`;
            const [rows] = await db.query(query, [id]);
            return rows[0]; // Return single record for the provided ID
        } else {
            query += ` ORDER BY id DESC`;
            const [rows] = await db.query(query);
            return rows; // Return all records sorted by ID
        }
    },

    // Fetches discipline records by student ID
    getByStudent: async (studentId) => {
        const query = `
            SELECT * FROM discipline
            WHERE student_id = ?
            ORDER BY date DESC
        `;
        const [rows] = await db.query(query, [studentId]);
        return rows; // Return all discipline records for the student
    },

    // Gets the list of hours for a specific date and student
    getHoursList: async (date, studentId) => {
        const query = `
            SELECT SUM(discipline.justified) AS justified, student_attendences.number_of_hours
            FROM student_attendences
            LEFT JOIN discipline ON discipline.date = student_attendences.date
            WHERE student_attendences.date = ? 
            AND student_attendences.student_session_id = ?
            GROUP BY discipline.date
            ORDER BY student_attendences.id DESC
        `;
        const [rows] = await db.query(query, [date, studentId]);
        return rows[0]; // Return single record of hours
    },

    // Fetches the list of hours for editing purposes (same as above but excluding a certain discipline ID)
    getHoursListEdit: async (date, studentId, id) => {
        const query = `
            SELECT SUM(discipline.justified) AS justified, student_attendences.number_of_hours
            FROM student_attendences
            LEFT JOIN discipline ON discipline.date = student_attendences.date
            WHERE student_attendences.date = ? 
            AND student_attendences.student_session_id = ?
            GROUP BY discipline.date
            ORDER BY student_attendences.id DESC
        `;
        const [rows] = await db.query(query, [date, studentId]);
        return rows[0]; // Return single record of hours
    },

    // Deletes a discipline record by its ID
    remove: async (id) => {
        const query = `DELETE FROM discipline WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Adds a new discipline record or updates an existing one if an ID is provided
    add: async (data) => {
        if (data.id) {
            const query = `
                UPDATE discipline
                SET student_id = ?, date = ?, justified = ?, description = ?
                WHERE id = ?
            `;
            await db.query(query, [data.student_id, data.date, data.justified, data.description, data.id]);
        } else {
            const query = `
                INSERT INTO discipline (student_id, date, justified, description)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [data.student_id, data.date, data.justified, data.description]);
            return result.insertId; // Return the ID of the inserted record
        }
    }
};

export default DisciplineModel;
