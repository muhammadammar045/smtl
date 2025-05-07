// adminModel.js
import { db } from "../db/conn.js";

const adminModel = {
    get: async (id = null) => {
        const query = id
            ? 'SELECT * FROM admin WHERE id = ?'
            : 'SELECT * FROM admin ORDER BY id';
        const [rows] = await db.query(query, id ? [id] : []);
        return id ? rows[0] : rows;
    },

    remove: async (id) => {
        await db.query('DELETE FROM admin WHERE id = ?', [id]);
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE admin SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            await db.query('INSERT INTO admin SET ?', [data]);
        }
    },

    checkLogin: async ({ username, password }) => {
        const [rows] = await db.query(
            'SELECT id, username, password FROM admin WHERE email = ? AND password = MD5(?) LIMIT 1',
            [username, password]
        );
        return rows.length === 1 ? rows : false;
    },

    readUserInformation: async (email) => {
        const [rows] = await db.query(
            'SELECT * FROM admin WHERE email = ? LIMIT 1',
            [email]
        );
        return rows.length === 1 ? rows : false;
    },

    readByEmail: async (email) => {
        const [rows] = await db.query(
            'SELECT * FROM admin WHERE email = ? LIMIT 1',
            [email]
        );
        return rows.length === 1 ? rows[0] : false;
    },

    updateVerCode: async (data) => {
        const { id, ...fields } = data;
        const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        const values = Object.values(fields);
        const [result] = await db.query(
            `UPDATE admin SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    },

    getAdminByCode: async (verification_code) => {
        const [rows] = await db.query(
            'SELECT * FROM admin WHERE verification_code = ? LIMIT 1',
            [verification_code]
        );
        return rows.length === 1 ? rows[0] : false;
    },

    changePassword: async ({ id }) => {
        const [rows] = await db.query(
            'SELECT password FROM admin WHERE id = ? LIMIT 1',
            [id]
        );
        return rows.length === 1 ? rows : false;
    },

    checkOldPass: async ({ user_id, user_email }) => {
        const [rows] = await db.query(
            'SELECT id FROM staff WHERE id = ? AND email = ?',
            [user_id, user_email]
        );
        return rows.length > 0;
    },

    saveNewPass: async (data) => {
        const { id, ...fields } = data;
        const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        const values = Object.values(fields);
        const [result] = await db.query(
            `UPDATE staff SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    },

    saveForgotPass: async (data) => {
        const { email, ...fields } = data;
        const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        const values = Object.values(fields);
        const [result] = await db.query(
            `UPDATE admin SET ${setClause} WHERE email = ?`,
            [...values, email]
        );
        return result.affectedRows > 0;
    },

    addReceipt: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE fee_receipt_no SET ${setClause} WHERE id = ?`, [...values, id]);
            return id;
        } else {
            const [res] = await db.query('INSERT INTO fee_receipt_no SET ?', [data]);
            return res.insertId;
        }
    },

    getMonthlyCollection: async (startYear, endYear) => {
        const [rows] = await db.query(
            `SELECT SUM(amount + amount_fine - amount_discount) as amount,
              MONTH(date) as month,
              YEAR(date) as year
       FROM student_fees
       WHERE YEAR(date) BETWEEN ? AND ?
       GROUP BY MONTH(date)`,
            [startYear, endYear]
        );
        return rows;
    },

    getMonthlyExpense: async (startYear, endYear) => {
        const [rows] = await db.query(
            `SELECT SUM(amount) as amount,
              MONTH(date) as month,
              YEAR(date) as year
       FROM expenses
       WHERE YEAR(date) BETWEEN ? AND ?
       GROUP BY MONTH(date)`,
            [startYear, endYear]
        );
        return rows;
    },

    getCollectionByDay: async (date) => {
        const [rows] = await db.query(
            `SELECT SUM(amount + amount_fine - amount_discount) as amount
       FROM student_fees
       WHERE date = ?`,
            [date]
        );
        return rows;
    },

    getExpenseByDay: async (date) => {
        const [rows] = await db.query(
            `SELECT SUM(amount) as amount
       FROM expenses
       WHERE date = ?`,
            [date]
        );
        return rows;
    }
};

export default adminModel;