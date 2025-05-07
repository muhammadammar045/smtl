import { db } from "../db/conn.js";

const accountantModel = {
    get: async (id = null) => {
        let query = `
             SELECT accountants.*,
             users.id AS user_tbl_id,
             users.username,
             users.password AS user_tbl_password,
             users.is_active AS user_tbl_active
            FROM accountants
            LEFT JOIN users ON users.user_id = accountants.id
            WHERE users.role = 'accountant'
    `;
        const params = [];

        if (id) {
            query += ' AND accountants.id = ?';
            params.push(id);
        } else {
            query += ' ORDER BY accountants.id';
        }

        const [rows] = await db.query(query, params);
        return id ? rows[0] : rows;
    },

    remove: async (id) => {
        await db.query('DELETE FROM accountants WHERE id = ?', [id]);
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...updateFields } = data;
            const columns = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateFields);
            await db.query(`UPDATE accountants SET ${columns} WHERE id = ?`, [...values, id]);
            return id;
        } else {
            const [result] = await db.query('INSERT INTO accountants SET ?', [data]);
            return result.insertId;
        }
    },

    searchNameLike: async (searchTerm) => {
        const [rows] = await db.query(`
      SELECT * FROM accountants
      WHERE name LIKE ?
      ORDER BY id
    `, [`%${searchTerm}%`]);
        return rows;
    }
};

export default accountantModel;