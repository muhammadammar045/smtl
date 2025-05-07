// attendanceTypeModel.js
import db from '../db.js'; // Adjust the path to your db connection file

const attendanceTypeModel = {
    get: async (id = null) => {
        let query;
        let params = [];

        if (id !== null) {
            query = 'SELECT * FROM attendence_type WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM attendence_type WHERE is_active = "yes" ORDER BY id';
        }

        const [rows] = await db.query(query, params);
        return id !== null ? rows[0] : rows;
    },

    getAttType: async (id = null) => {
        let query;
        let params = [];

        if (id !== null) {
            query = 'SELECT * FROM attendence_type WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM attendence_type ORDER BY id';
        }

        const [rows] = await db.query(query, params);
        return id !== null ? rows[0] : rows;
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE attendence_type SET ${setClause} WHERE id = ?`, [...values, id]);
        } else {
            await db.query('INSERT INTO attendence_type SET ?', [data]);
        }
    },

    getStaffAttendanceType: async (id = null) => {
        let query;
        let params = [];

        if (id !== null) {
            query = 'SELECT * FROM staff_attendance_type WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM staff_attendance_type WHERE is_active = "yes" ORDER BY id';
        }

        const [rows] = await db.query(query, params);
        return id !== null ? rows[0] : rows;
    },

    getStudentAttendance: async (date, studentSessionId) => {
        const query = `
      SELECT attendence_type.type 
      FROM bio_users_logs 
      INNER JOIN bio_users ON bio_users_logs.card_uid = bio_users.card_uid
      INNER JOIN attendence_type ON attendence_type.id = bio_users_logs.staff_attendance_type_id
      WHERE bio_users_logs.std_id = ? AND bio_users_logs.checkindate = ?
    `;
        const [rows] = await db.query(query, [studentSessionId, date]);
        return rows.length > 0 ? rows[0] : null;
    }
};

export default attendanceTypeModel;
