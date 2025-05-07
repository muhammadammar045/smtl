// categoryModel.js
import db from '../db.js';

const categoryModel = {
    get: async (id = null) => {
        if (id !== null) {
            const [rows] = await db.query(`SELECT * FROM categories WHERE id = ?`, [id]);
            return rows[0];
        } else {
            const [rows] = await db.query(`SELECT * FROM categories ORDER BY id`);
            return rows;
        }
    },

    remove: async (id) => {
        await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    },

    add: async (data) => {
        if ('id' in data) {
            const { id, ...updateData } = data;
            await db.query(`UPDATE categories SET ? WHERE id = ?`, [updateData, id]);
            return id;
        } else {
            const [result] = await db.query(`INSERT INTO categories SET ?`, [data]);
            return result.insertId;
        }
    }
};

export default categoryModel;
