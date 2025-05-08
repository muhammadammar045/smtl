// models/ExpenseModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const ExpenseModel = {
    // Get session data
    getSessionData: async () => {
        const parentCheck = await customlib.getLoggedInUserData(); // Assuming customlib is imported and available

        let userdata;
        if (parentCheck.role === "parent") {
            const recordNum = getLastSegmentOfUri(); // You may need to implement or retrieve the segment
            userdata = await customlib.getUserData(recordNum);
        } else {
            userdata = await customlib.getUserData();
        }

        let campusId = userdata.student_session_id ? userdata.campus_main_id : userdata.campus_ids;
        const selectedCampus = userdata.student_session_id ? campusId : getCookie("cookie_selected_campus");

        const campusIds = campusId.split(",");
        const totalSession = {};
        campusIds.forEach(campusId => {
            const sessionId = settingModel.getCurrentSession2(campusId); // Assuming settingModel is imported
            totalSession[campusId] = sessionId;
        });

        return totalSession;
    },

    // Get campus data
    getCampusData: async () => {
        const parentCheck = await customlib.getLoggedInUserData();

        let userdata;
        if (parentCheck.role === "parent") {
            const recordNum = getLastSegmentOfUri();
            userdata = await customlib.getUserData(recordNum);
        } else {
            userdata = await customlib.getUserData();
        }

        let campusId = userdata.campus_ids;
        const selectedCampus = getCookie("cookie_selected_campus");

        const campusIds = campusId.split(",");
        const campusData = {};
        campusIds.forEach(campusId => {
            campusData[campusId] = campusId;
        });

        return campusData;
    },

    // Search expenses
    search: async (text = null, startDate = null, endDate = null, campusId = null) => {
        let query = `
            SELECT expenses.id, expenses.campus_id, expenses.date, expenses.invoice_no, expenses.name, expenses.amount, expenses.documents, expenses.note, expense_head.exp_category, expenses.exp_head_id
            FROM expenses
            JOIN expense_head ON expenses.exp_head_id = expense_head.id`;

        const params = [];
        if (text) {
            query += ` WHERE expenses.name LIKE ?`;
            params.push(`%${text}%`);
        }

        if (startDate && endDate) {
            query += ` WHERE expenses.date >= ? AND expenses.date <= ?`;
            params.push(startDate, endDate);
        }

        if (campusId) {
            query += ` AND expenses.campus_id = ?`;
            params.push(campusId);
        }

        const [rows] = await db.query(query, params);
        return rows;
    },

    // Get monthly report
    getMonthlyReport: async (startDate = null, endDate = null, campusId = null) => {
        let query = `
            SELECT SUM(expenses.amount) AS total_amount, expenses.date, campus.campus, campus.id AS campus_id
            FROM expenses
            JOIN expense_head ON expenses.exp_head_id = expense_head.id
            LEFT JOIN campus ON expenses.campus_id = campus.id
            WHERE expenses.date >= ? AND expenses.date <= ?`;

        const params = [startDate, endDate];
        if (campusId) {
            query += ` AND expenses.campus_id = ?`;
            params.push(campusId);
        }

        query += ` GROUP BY expenses.date, expenses.campus_id ORDER BY expenses.date DESC`;

        const [rows] = await db.query(query, params);
        return rows;
    },

    // Get monthly report full
    getMonthlyReportFull: async (startDate = null, endDate = null, campusId = null) => {
        let query = `
            SELECT SUM(expenses.amount) AS total_amount
            FROM expenses
            JOIN expense_head ON expenses.exp_head_id = expense_head.id
            WHERE expenses.date >= ? AND expenses.date <= ?`;

        const params = [startDate, endDate];
        if (campusId) {
            query += ` AND expenses.campus_id = ?`;
            params.push(campusId);
        }

        query += ` ORDER BY expenses.date DESC`;

        const [rows] = await db.query(query, params);
        return rows;
    },

    // Get details of expenses by date and campus
    detailReport: async (date = null, campusId = null) => {
        let query = `
            SELECT expenses.id, expenses.campus_id, expenses.date, expenses.name, expenses.invoice_no, expenses.amount, expenses.documents, expenses.note, expense_head.exp_category, expenses.exp_head_id
            FROM expenses
            JOIN expense_head ON expenses.exp_head_id = expense_head.id`;

        const params = [];
        if (date) {
            query += ` WHERE expenses.date = ?`;
            params.push(date);
        }

        if (campusId) {
            query += ` AND expenses.campus_id = ?`;
            params.push(campusId);
        }

        const [rows] = await db.query(query, params);
        return rows;
    },

    // Get expense by date
    getByDate: async (date = null, campusId = null) => {
        return await ExpenseModel.detailReport(date, campusId);
    },

    // Get a specific expense or all expenses
    get: async (id = null) => {
        let query = `
            SELECT campus.campus, expenses.campus_id, expenses.id, expenses.date, expenses.name, expenses.invoice_no, expenses.amount, expenses.documents, expenses.note, expense_head.exp_category, expenses.exp_head_id
            FROM expenses
            JOIN expense_head ON expenses.exp_head_id = expense_head.id
            JOIN campus ON expenses.campus_id = campus.id`;

        const params = [];
        if (id) {
            query += ` WHERE expenses.id = ?`;
            params.push(id);
        } else {
            query += ` ORDER BY expenses.id DESC`;
        }

        const [rows] = await db.query(query, params);
        return id ? rows[0] : rows;
    },

    // Remove an expense by ID
    remove: async (id) => {
        const query = `DELETE FROM expenses WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Remove an expense by date and campus
    removeByDate: async (date, campusId) => {
        const query = `DELETE FROM expenses WHERE date = ? AND campus_id = ?`;
        await db.query(query, [date, campusId]);
    },

    // Add or update an expense
    add: async (data) => {
        if (data.id) {
            const query = `UPDATE expenses SET ? WHERE id = ?`;
            await db.query(query, [data, data.id]);
        } else {
            const query = `INSERT INTO expenses SET ?`;
            const [result] = await db.query(query, [data]);
            return result.insertId;
        }
    },

    // Check if expense group exists
    checkExitsGroup: async (data) => {
        const totalSession = await ExpenseModel.getSessionData();
        const campusIds = await ExpenseModel.getCampusData();

        const query = `
            SELECT * FROM expenses
            WHERE session_id = ? AND feetype_id = ? AND class_id = ?
            LIMIT 1`;
        const [rows] = await db.query(query, [currentSession, data.feetype_id, data.class_id]);

        return rows.length === 0;
    },

    // Get type by fee category
    getTypeByFeeCategory: async (type, classId) => {
        const query = `
            SELECT expenses.id, expenses.campus_id, expenses.session_id, expenses.invoice_no, expenses.amount, expenses.documents, expenses.note, expense_head.class, feetype.type
            FROM expenses
            JOIN expense_head ON expenses.class_id = expense_head.id
            JOIN feetype ON expenses.feetype_id = feetype.id
            WHERE expenses.class_id = ? AND expenses.feetype_id = ? AND expenses.session_id = ?
            ORDER BY expenses.id`;
        const [rows] = await db.query(query, [classId, type, currentSession]);

        return rows[0];
    },

    // Get total expense by date
    getTotalExpenseByDate: async (date) => {
        const query = `SELECT SUM(amount) AS amount FROM expenses WHERE date = ?`;
        const [rows] = await db.query(query, [date]);
        return rows[0];
    },

    // Get total expense between two dates
    getTotalExpenseByDateRange: async (dateFrom, dateTo) => {
        const query = `
            SELECT SUM(amount) AS amount
            FROM expenses
            WHERE date BETWEEN ? AND ?`;

        const [rows] = await db.query(query, [dateFrom, dateTo]);
        return rows[0];
    }
};

export default ExpenseModel;
