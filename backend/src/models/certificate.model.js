import { db } from "../db/conn.js";

const CertificateModel = {
    addCertificate: async (data) => {
        if (data.id) {
            const { id, ...updateFields } = data;
            const columns = Object.keys(updateFields).map(key => `${key} = ?`).join(", ");
            const values = Object.values(updateFields);
            await db.query(`UPDATE certificates SET ${columns} WHERE id = ?`, [...values, id]);
            return id;
        } else {
            const [result] = await db.query("INSERT INTO certificates SET ?", [data]);
            return result.insertId;
        }
    },

    certificateList: async () => {
        const [rows] = await db.query(`
            SELECT * FROM certificates
            WHERE status = 1 AND created_for = 2
        `);
        return rows;
    },

    get: async (id) => {
        const [rows] = await db.query(`
            SELECT * FROM certificates
            WHERE status = 1 AND id = ?
        `, [id]);
        return rows;
    },

    remove: async (id) => {
        await db.query("DELETE FROM certificates WHERE id = ?", [id]);
    },

    getStudentCertificate: async () => {
        const [rows] = await db.query(`
            SELECT * FROM certificates
            WHERE created_for = 2
        `);
        return rows;
    },

    certificateById: async (id) => {
        const [rows] = await db.query(`
            SELECT * FROM certificates
            WHERE id = ?
        `, [id]);
        return rows.length > 0 ? rows[0] : null;
    },
};

export default CertificateModel;
