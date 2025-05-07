// avertissementsModel.js
import db from '../db.js'; // Adjust path to your actual db.js

const avertissementsModel = {
    get: async (id = null) => {
        let query = 'SELECT * FROM avertissements';
        let params = [];

        if (id !== null) {
            query += ' WHERE id = ?';
            params = [id];
        } else {
            query += ' ORDER BY id DESC';
        }

        const [rows] = await db.query(query, params);
        return id !== null ? rows[0] : rows;
    },

    getByStudent: async (studentId) => {
        const query = `
      SELECT * FROM avertissements
      WHERE student_id = ?
      ORDER BY date DESC
    `;
        const [rows] = await db.query(query, [studentId]);
        return rows;
    },

    remove: async (id) => {
        const query = 'DELETE FROM avertissements WHERE id = ?';
        await db.query(query, [id]);
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE avertissements SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            const [result] = await db.query('INSERT INTO avertissements SET ?', [data]);
            return result.insertId;
        }
    }
};

export default avertissementsModel;
