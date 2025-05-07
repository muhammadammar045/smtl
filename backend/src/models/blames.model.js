// blamesModel.js
import db from '../db.js';
import customlib from '../lib/customlib.js';
import settingModel from './settingModel.js';

const blamesModel = {
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

        let campusId, selectedCampus;
        if (userdata.student_session_id !== '') {
            campusId = userdata.campus_main_id;
            selectedCampus = campusId;
        } else {
            campusId = userdata.campus_ids;
            selectedCampus = req.cookies?.cookie_selected_campus || null;
        }

        const campusPieces = campusId.split(',');
        const totalSession = {};

        for (const campId of campusPieces) {
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

        const campusId = userdata.campus_ids;
        const campusPieces = campusId.split(',');
        const campusIdz = {};

        for (const campId of campusPieces) {
            await settingModel.getCurrentSession2(campId); // May be used elsewhere
            campusIdz[campId] = campId;
        }

        return campusIdz;
    },

    get: async (id = null) => {
        let query = 'SELECT * FROM blames';
        const params = [];

        if (id !== null) {
            query += ' WHERE id = ?';
            params.push(id);
        } else {
            query += ' ORDER BY id DESC';
        }

        const [rows] = await db.query(query, params);
        return id !== null ? rows[0] : rows;
    },

    getByStudent: async (studentId) => {
        const query = 'SELECT * FROM blames WHERE student_id = ? ORDER BY date DESC';
        const [rows] = await db.query(query, [studentId]);
        return rows;
    },

    remove: async (id) => {
        const query = 'DELETE FROM blames WHERE id = ?';
        await db.query(query, [id]);
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE blames SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            const [result] = await db.query('INSERT INTO blames SET ?', [data]);
            return result.insertId;
        }
    }
};

export default blamesModel;
