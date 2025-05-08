// models/ComplaintModel.js

import { db } from "../db/conn.js";

const ComplaintModel = {
    add: async (data) => {
        const [result] = await db.query(`INSERT INTO complaint SET ?`, [data]);
        return result.insertId;
    },

    imageAdd: async (complaintId, image) => {
        const [result] = await db.query(
            `UPDATE complaint SET image = ? WHERE id = ?`,
            [image, complaintId]
        );
        return result.affectedRows > 0;
    },

    complaintList: async (id = null) => {
        let sql = `SELECT * FROM complaint`;
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

    imageDelete: async (id, imgName) => {
        const filePath = `./uploads/front_office/complaints/${imgName}`;
        const fs = require('fs');
        fs.unlinkSync(filePath);  // Remove the file from the server

        const [result] = await db.query(`DELETE FROM complaint WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    complaintUpdate: async (id, data) => {
        const [result] = await db.query(`UPDATE complaint SET ? WHERE id = ?`, [data, id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query(`DELETE FROM complaint WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    getComplaintType: async () => {
        const [rows] = await db.query(`SELECT * FROM complaint_type`);
        return rows;
    },

    getComplaintSource: async () => {
        const [rows] = await db.query(`SELECT * FROM source`);
        return rows;
    }
};

export default ComplaintModel;
