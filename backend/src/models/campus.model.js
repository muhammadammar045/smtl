// campusModel.js
import db from '../db.js';

const campusModel = {
    add: async (table, data) => {
        await db.query(`INSERT INTO ?? SET ?`, [table, data]);
    },

    get: async (table, id = null) => {
        if (id !== null) {
            const [rows] = await db.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
            return rows[0];
        } else {
            const [rows] = await db.query(`SELECT * FROM ?? ORDER BY id`, [table]);
            return rows;
        }
    },

    getAssigned: async (table, id = null, userContext) => {
        const { role_id, campus_ids } = userContext;
        const campusIdsArray = campus_ids.split(',').map(id => parseInt(id));

        let sql = `SELECT * FROM ??`;
        const params = [table];

        const whereClauses = [];
        if (role_id != 7) {
            whereClauses.push(`id IN (?)`);
            params.push(campusIdsArray);
        }

        if (id !== null) {
            whereClauses.push(`id = ?`);
            params.push(id);
        }

        if (whereClauses.length > 0) {
            sql += ` WHERE ` + whereClauses.join(' AND ');
        }

        sql += ` ORDER BY id`;

        const [rows] = await db.query(sql, params);
        return id ? rows[0] : rows;
    },

    update: async (table, campus_id, data) => {
        const [result] = await db.query(`UPDATE ?? SET ? WHERE id = ?`, [table, data, campus_id]);
        return result.affectedRows > 0;
    },

    delete: async (table, id) => {
        await db.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
    }
};

export default campusModel;
