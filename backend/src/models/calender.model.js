// calendarModel.js
import db from '../db.js';

const calendarModel = {
    saveEvent: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE events SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            await db.query('INSERT INTO events SET ?', [data]);
        }
    },

    getEvents: async (id = null) => {
        if (id) {
            const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
            return rows[0];
        } else {
            const [rows] = await db.query('SELECT * FROM events');
            return rows;
        }
    },

    getStudentEvents: async () => {
        const [rows] = await db.query(
            `SELECT * FROM events WHERE event_type = 'public' OR event_type = 'task'`
        );
        return rows;
    },

    deleteEvent: async (id) => {
        await db.query('DELETE FROM events WHERE id = ?', [id]);
    },

    getTask: async (limit = null, offset = null, userId) => {
        let sql = `SELECT * FROM events WHERE event_type = 'task' AND event_for = ? ORDER BY is_active, start_date ASC`;
        if (limit != null && offset != null) {
            sql += ' LIMIT ? OFFSET ?';
            const [rows] = await db.query(sql, [userId, limit, offset]);
            return rows;
        } else {
            const [rows] = await db.query(sql, [userId]);
            return rows;
        }
    },

    countRows: async () => {
        const [rows] = await db.query(`SELECT COUNT(*) as count FROM events WHERE event_type = 'task'`);
        return rows[0].count;
    },

    countIncompleteTask: async (userId) => {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM events WHERE event_type = 'task' AND is_active = 'no' AND event_for = ? AND start_date = ?`,
            [userId, today]
        );
        return rows[0].count;
    },

    getIncompleteTask: async (userId) => {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await db.query(
            `SELECT * FROM events WHERE event_type = 'task' AND is_active = 'no' AND event_for = ? AND start_date = ? ORDER BY start_date ASC`,
            [userId, today]
        );
        return rows;
    }
};

export default calendarModel;
