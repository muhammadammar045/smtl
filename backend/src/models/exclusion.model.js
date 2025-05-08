// models/ExclusionsModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const ExclusionsModel = {
    // Get a specific exclusion or all exclusions
    get: async (id = null) => {
        let query = `SELECT exclusions.* FROM exclusions`;
        const params = [];

        if (id != null) {
            query += ` WHERE exclusions.id = ?`;
            params.push(id);
        } else {
            query += ` ORDER BY exclusions.id DESC`;
        }

        const [rows] = await db.query(query, params);
        return id != null ? rows[0] : rows;
    },

    // Get exclusions by student ID
    getByStudent: async (studentId) => {
        const query = `
            SELECT exclusions.* FROM exclusions
            WHERE exclusions.student_id = ?
            ORDER BY exclusions.date DESC`;

        const [rows] = await db.query(query, [studentId]);
        return rows;
    },

    // Remove an exclusion by ID
    remove: async (id) => {
        const query = `DELETE FROM exclusions WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Add or update an exclusion
    add: async (data) => {
        if (data.id) {
            const query = `UPDATE exclusions SET ? WHERE id = ?`;
            await db.query(query, [data, data.id]);
        } else {
            const query = `INSERT INTO exclusions SET ?`;
            const [result] = await db.query(query, [data]);
            return result.insertId; // Return inserted ID
        }
    }
};

export default ExclusionsModel;
