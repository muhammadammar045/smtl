// models/ComplaintTypeModel.js

import { db } from "../db/conn.js";

const ComplaintTypeModel = {
    add: async (table, data) => {
        const [result] = await db.query(`INSERT INTO ?? SET ?`, [table, data]);
        return result.insertId;
    },

    get: async (table, id = null) => {
        let sql = `SELECT * FROM ??`;
        const params = [table];

        if (id !== null) {
            sql += ` WHERE id = ?`;
            params.push(id);
        } else {
            sql += ` ORDER BY id`;
        }

        const [rows] = await db.query(sql, params);
        return id !== null ? rows[0] || null : rows;
    },

    update: async (table, complaintTypeId, data) => {
        const [result] = await db.query(
            `UPDATE ?? SET ? WHERE id = ?`,
            [table, data, complaintTypeId]
        );
        return result.affectedRows > 0;
    },

    delete: async (table, id) => {
        const [result] = await db.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
        return result.affectedRows > 0;
    }
};

export default ComplaintTypeModel;
