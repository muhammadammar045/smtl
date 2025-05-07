// bookModel.js
import db from '../db.js';
import customlib from '../lib/customlib.js';
import settingModel from './settingModel.js';

const bookModel = {
    getSessionData: async (req) => {
        const parentCheck = customlib.getLoggedInUserData(req);
        let userdata;

        if (parentCheck.role === 'parent') {
            const segments = req.url.split('/');
            const recordNum = segments[segments.length - 1];
            userdata = customlib.getUserData(recordNum);
        } else {
            userdata = customlib.getUserData();
        }

        let campusId;
        if (userdata.student_session_id !== '') {
            campusId = userdata.campus_main_id;
        } else {
            campusId = userdata.campus_ids;
        }

        const pieces = campusId.split(',');
        const totalSession = {};

        for (const campId of pieces) {
            const sessionId = await settingModel.getCurrentSession2(campId);
            totalSession[campId] = sessionId;
        }

        return totalSession;
    },

    getCampusData: async (req) => {
        const parentCheck = customlib.getLoggedInUserData(req);
        let userdata;

        if (parentCheck.role === 'parent') {
            const segments = req.url.split('/');
            const recordNum = segments[segments.length - 1];
            userdata = customlib.getUserData(recordNum);
        } else {
            userdata = customlib.getUserData();
        }

        const pieces = userdata.campus_ids.split(',');
        const campusIdz = {};

        for (const campId of pieces) {
            await settingModel.getCurrentSession2(campId); // Use if needed
            campusIdz[campId] = campId;
        }

        return campusIdz;
    },

    get: async (id = null) => {
        const sql = id
            ? 'SELECT * FROM books WHERE id = ?'
            : 'SELECT * FROM books ORDER BY id';
        const [rows] = await db.query(sql, id ? [id] : []);
        return id ? rows[0] : rows;
    },

    getBookWithQty: async () => {
        const sql = `
      SELECT books.*, IFNULL(total_issue, '0') as total_issue
      FROM books
      LEFT JOIN (
        SELECT COUNT(*) as total_issue, book_id
        FROM book_issues
        WHERE is_returned = 0
        GROUP BY book_id
      ) AS book_count ON books.id = book_count.book_id
    `;
        const [rows] = await db.query(sql);
        return rows.length > 0 ? rows : false;
    },

    remove: async (id) => {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
    },

    addBooks: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE books SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            const [result] = await db.query('INSERT INTO books SET ?', [data]);
            return result.insertId;
        }
    },

    listBook: async () => {
        const [rows] = await db.query('SELECT * FROM books ORDER BY id DESC LIMIT 10');
        return rows;
    },

    checkExitsGroup: async (data, req) => {
        const totalSession = await bookModel.getSessionData(req);
        const selectedCampus = req.cookies?.cookie_selected_campus;
        const currentSession = await settingModel.getCurrentSession(); // Fallback if needed

        const sql = `
      SELECT * FROM feemasters
      WHERE session_id = ? AND feetype_id = ? AND class_id = ?
      LIMIT 1
    `;
        const [rows] = await db.query(sql, [currentSession, data.feetype_id, data.class_id]);
        return rows.length === 0;
    },

    getTypeByFeecategory: async (type, classId, req) => {
        const totalSession = await bookModel.getSessionData(req);
        const currentSession = await settingModel.getCurrentSession();

        const sql = `
      SELECT feemasters.id, feemasters.session_id, feemasters.amount, feemasters.description,
             classes.class, feetype.type
      FROM feemasters
      JOIN classes ON feemasters.class_id = classes.id
      JOIN feetype ON feemasters.feetype_id = feetype.id
      WHERE feemasters.class_id = ? AND feemasters.feetype_id = ? AND feemasters.session_id = ?
      ORDER BY feemasters.id
    `;
        const [rows] = await db.query(sql, [classId, type, currentSession]);
        return rows[0];
    }
};

export default bookModel;
