// models/ConferenceModel.js

import { db } from "../db/conn.js";

const ConferenceModel = {
    getSessionData: async (userdata, settingModel) => {
        let total_session = {};
        let campus_idz = {};
        let campus_id = userdata.student_session_id ? userdata.campus_main_id : userdata.campus_ids;
        let selected_campus = userdata.student_session_id ? campus_id : userdata.selected_campus_cookie;
        let pieces = campus_id.split(',');

        for (let camp_id of pieces) {
            let session_id = await settingModel.getCurrentSession2(camp_id);
            total_session[camp_id] = session_id;
            campus_idz[camp_id] = camp_id;
        }

        return total_session;
    },

    getCampusData: async (userdata, settingModel) => {
        let campus_id = userdata.campus_ids;
        let selected_campus = userdata.selected_campus_cookie;
        let pieces = campus_id.split(',');
        let campus_idz = {};

        for (let camp_id of pieces) {
            let session_id = await settingModel.getCurrentSession2(camp_id);
            campus_idz[camp_id] = camp_id;
        }

        return campus_idz;
    },

    add: async (data, current_session) => {
        data.session_id = current_session;
        const [result] = await db.query('INSERT INTO conferences SET ?', [data]);
        return result.insertId;
    },

    addMeeting: async (data, staff) => {
        await db.beginTransaction();

        try {
            const [insertResult] = await db.query('INSERT INTO conferences SET ?', [data]);
            const insert_id = insertResult.insertId;

            if (staff && staff.length) {
                const staffList = staff.map(staff_value => ({
                    conference_id: insert_id,
                    staff_id: staff_value,
                }));
                await db.query('INSERT INTO conference_staff (conference_id, staff_id) VALUES ?', [staffList]);
            }

            await db.commit();
            return true;
        } catch (err) {
            await db.rollback();
            throw err;
        }
    },

    get: async (id = null) => {
        let sql = `SELECT conferences.*, for_create.name AS create_for_name, for_create.surname AS create_for_surname, 
                      create_by.name AS create_by_name, create_by.surname AS create_by_surname, 
                      classes.class, sections.section
               FROM conferences
               LEFT JOIN staff AS for_create ON for_create.id = conferences.staff_id
               LEFT JOIN staff AS create_by ON create_by.id = conferences.created_id
               LEFT JOIN classes ON classes.id = conferences.class_id
               LEFT JOIN sections ON sections.id = conferences.section_id`;

        if (id) {
            sql += ' WHERE conferences.id = ?';
            const [rows] = await db.query(sql, [id]);
            return rows[0];
        } else {
            sql += ' ORDER BY conferences.id';
            const [rows] = await db.query(sql);
            return rows;
        }
    },

    getByStaff: async (staff_id = null, current_session) => {
        let sql = `SELECT campus.campus, conferences.*, classes.class, sections.section, 
                      for_create.name AS create_for_name, for_create.surname AS create_for_surname, 
                      create_by.name AS create_by_name, create_by.surname AS create_by_surname, 
                      for_create.employee_id AS for_create_employee_id, for_create_role.name AS for_create_role_name, 
                      create_by_role.name AS create_by_role_name, create_by.employee_id AS create_by_employee_id
               FROM conferences
               JOIN classes ON classes.id = conferences.class_id
               JOIN sections ON sections.id = conferences.section_id
               JOIN staff AS for_create ON for_create.id = conferences.staff_id
               JOIN staff AS create_by ON create_by.id = conferences.created_id
               JOIN staff_roles ON staff_roles.staff_id = for_create.id
               JOIN campus ON conferences.campus_id = campus.id
               JOIN roles AS for_create_role ON for_create_role.id = staff_roles.role_id
               JOIN staff_roles AS staff_create_by_roles ON staff_create_by_roles.staff_id = create_by.id
               JOIN roles AS create_by_role ON create_by_role.id = staff_create_by_roles.role_id
               WHERE conferences.session_id = ?`;

        if (staff_id) {
            sql += ' AND conferences.staff_id = ?';
            const [rows] = await db.query(sql, [current_session, staff_id]);
            return rows;
        } else {
            sql += ' ORDER BY conferences.date DESC';
            const [rows] = await db.query(sql, [current_session]);
            return rows;
        }
    },

    removeEntries: async (value) => {
        const [result] = await db.query('DELETE FROM conferences WHERE id = ?', [value]);
        return result.affectedRows > 0;
    },

    remove: async (id) => {
        await db.beginTransaction();

        try {
            const [result] = await db.query('DELETE FROM conferences WHERE id = ?', [id]);

            if (result.affectedRows > 0) {
                await db.commit();
                return true;
            } else {
                throw new Error('Conference not found');
            }
        } catch (err) {
            await db.rollback();
            throw err;
        }
    },

    update: async (id, data) => {
        await db.beginTransaction();

        try {
            const [result] = await db.query('UPDATE conferences SET ? WHERE id = ?', [data, id]);

            if (result.affectedRows > 0) {
                await db.commit();
                return true;
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            await db.rollback();
            throw err;
        }
    },

    getByClassSection: async (class_id, section_id, campus_id, current_session, program_applied_for) => {
        const sql = `SELECT conferences_status.*, conferences.*, classes.class, sections.section, 
                        for_create.name AS create_for_name, for_create.surname AS create_for_surname, 
                        for_create.employee_id AS for_create_employee_id, for_create_role.name AS for_create_role_name
                 FROM conferences
                 JOIN classes ON classes.id = conferences.class_id
                 JOIN sections ON sections.id = conferences.section_id
                 JOIN staff AS for_create ON for_create.id = conferences.staff_id
                 JOIN staff_roles ON staff_roles.staff_id = for_create.id
                 JOIN roles AS for_create_role ON for_create_role.id = staff_roles.role_id
                 LEFT JOIN conferences_status ON conferences.id = conferences_status.conference_id 
                     AND conferences_status.conference_date = ?
                 WHERE (conferences.program_applied_for = ? OR conferences.program_applied_for = '1')
                 AND conferences.class_id = ?
                 AND conferences.campus_id = ?
                 AND conferences.session_id = ?
                 ORDER BY ordertime ASC`;

        const [rows] = await db.query(sql, [new Date().toISOString().split('T')[0], program_applied_for, class_id, campus_id, current_session]);
        return rows;
    }
};

export default ConferenceModel;
