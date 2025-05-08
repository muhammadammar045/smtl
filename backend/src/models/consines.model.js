// models/ConsignesModel.js

import { db } from "../db/conn.js";

const ConsignesModel = {
    get: async (id = null) => {
        let sql = `SELECT * FROM consignes`;
        const params = [];

        if (id !== null) {
            sql += ` WHERE id = ?`;
            params.push(id);
        } else {
            sql += ` ORDER BY id DESC`;
        }

        const [rows] = await db.query(sql, params);
        return id !== null ? rows[0] || null : rows;
    },

    getByStudent: async (studentId) => {
        const [rows] = await db.query(
            `SELECT * FROM consignes WHERE student_id = ? ORDER BY date DESC`,
            [studentId]
        );
        return rows;
    },

    remove: async (id) => {
        const [result] = await db.query(`DELETE FROM consignes WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    add: async (data) => {
        if (data.id) {
            const [result] = await db.query(
                `UPDATE consignes SET ? WHERE id = ?`,
                [data, data.id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(`INSERT INTO consignes SET ?`, [data]);
            return result.insertId;
        }
    }
};

export default ConsignesModel;
