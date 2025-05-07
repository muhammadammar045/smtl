import { db } from "../db/conn.js";

const UserModel = {
    add: async (data) => {
        if (data.id) {
            const { id, ...updateFields } = data;
            const columns = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateFields);
            await db.query(`UPDATE users SET ${columns} WHERE id = ?`, [...values, id]);
            return id;
        } else {
            const [result] = await db.query('INSERT INTO users SET ?', [data]);
            return result.insertId;
        }
    },

    addNewParent: async (parentData, studentData) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [res] = await conn.query('INSERT INTO users SET ?', [parentData]);
            const parentId = res.insertId;

            studentData.parent_id = parentId;
            await studentModel.add(conn, studentData); // should support passing connection

            await conn.commit();
            return true;
        } catch (err) {
            await conn.rollback();
            console.error('Transaction Error:', err);
            return false;
        } finally {
            conn.release();
        }
    },

    getFromUser: async (phone) => {
        const [rows] = await db.query(
            'SELECT username, password FROM users WHERE role = ? AND username = ?',
            ['parent', phone]
        );
        return rows;
    },

    getStudentData: async () => {
        const [rows] = await db.query(`
      SELECT users.username, users.password, students.mobileno, students.firstname
      FROM users
      INNER JOIN students ON students.id = users.user_id
      INNER JOIN student_session ON students.id = student_session.student_id
      WHERE student_session.campus_id = ?
        AND users.role = ?
        AND students.is_active = ?
      LIMIT 100 OFFSET 100
    `, [34, 'student', 'yes']);
        return rows;
    },

    getParentData: async () => {
        const [rows] = await db.query(`
      SELECT users.username, users.password, students.firstname, students.father_name, students.guardian_phone
      FROM users
      INNER JOIN students ON students.id = users.childs
      INNER JOIN student_session ON students.id = student_session.student_id
      WHERE student_session.campus_id = ?
        AND students.is_active = ?
        AND users.role = ?
    `, [37, 'yes', 'parent']);
        return rows;
    },

    checkLogin: async (data) => {
        const [rows] = await db.query(`
      SELECT id, username, password, role, is_active, def_status
      FROM users
      WHERE username LIKE ? AND password = ?
      LIMIT 1
    `, [`%${data.username}%`, data.password]);
        return rows.length === 1 ? rows : false;
    },

    checkLoginParent: async (data) => {
        const [rows] = await db.query(`
      SELECT users.*, students.admission_no, students.guardian_name, students.roll_no,
             students.admission_date, students.firstname, students.lastname,
             students.image, students.father_pic, students.mother_pic,
             students.guardian_pic, students.guardian_relation, students.mobileno,
             students.email, students.state, students.city, students.pincode,
             students.religion, students.dob, students.current_address,
             students.permanent_address
      FROM users
      INNER JOIN students ON students.parent_id = users.id
      WHERE users.username = ? AND users.password = ?
      LIMIT 1
    `, [data.username, data.password]);
        return rows.length === 1 ? rows : false;
    },

    readUserInformation: async (userId) => {
        const [rows] = await db.query(`
      SELECT users.*, students.firstname, students.image, students.lastname, students.guardian_name
      FROM users
      INNER JOIN students ON students.id = users.user_id
      WHERE students.is_active = ? AND users.id = ?
      LIMIT 1
    `, ['yes', userId]);
        return rows.length === 1 ? rows : false;
    },

    readTeacherInformation: async (userId) => {
        const [rows] = await db.query(`
      SELECT users.*, teachers.name
      FROM users
      INNER JOIN teachers ON teachers.id = users.user_id
      WHERE users.id = ?
      LIMIT 1
    `, [userId]);
        return rows.length === 1 ? rows : false;
    },

    readAccountantInformation: async (userId) => {
        const [rows] = await db.query(`
      SELECT users.*, accountants.name
      FROM users
      INNER JOIN accountants ON accountants.id = users.user_id
      WHERE users.id = ?
      LIMIT 1
    `, [userId]);
        return rows.length === 1 ? rows : false;
    },

    readLibrarianInformation: async (userId) => {
        const [rows] = await db.query(`
      SELECT users.*, librarians.name
      FROM users
      INNER JOIN librarians ON librarians.id = users.user_id
      WHERE users.id = ?
      LIMIT 1
    `, [userId]);
        return rows.length === 1 ? rows : false;
    },

    checkOldUsername: async (conn, data) => {
        const [rows] = await conn.execute(
            'SELECT id FROM users WHERE id = ? AND username = ?',
            [data.user_id, data.username]
        );
        return rows.length > 0;
    },

    checkOldPass: async (conn, data) => {
        const [rows] = await conn.execute(
            'SELECT id FROM users WHERE id = ? AND password = ?',
            [data.user_id, data.current_pass]
        );
        return rows.length > 0;
    },

    checkUserNameExist: async (conn, data) => {
        const [rows] = await conn.execute(
            'SELECT id FROM users WHERE role = ? AND username = ?',
            [data.role, data.new_username]
        );
        return rows.length > 0;
    },

    saveNewPass: async (conn, data) => {
        const [result] = await conn.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [data.password, data.id]
        );
        return result.affectedRows > 0;
    },

    changeStatus: async (conn, data) => {
        const [result] = await conn.execute(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [data.is_active, data.id]
        );
        return result.affectedRows > 0;
    },

    saveNewUsername: async (conn, data) => {
        const [result] = await conn.execute(
            'UPDATE users SET username = ? WHERE id = ?',
            [data.username, data.id]
        );
        return result.affectedRows > 0;
    },

    readUser: async (conn) => {
        const [rows] = await conn.query('SELECT * FROM users');
        return rows.length > 0 ? rows : false;
    },

    readSingleChild: async (conn, child_id) => {
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE childs = ?',
            [child_id]
        );
        return rows.length > 0 ? rows[0] : false;
    },

    getLoginDetails: async (conn, student_id) => {
        const query = `
          SELECT * FROM (
            SELECT * FROM users WHERE FIND_IN_SET(?, childs) <> 0
            UNION
            SELECT * FROM users 
            WHERE user_id = ? AND role NOT IN ('teacher', 'librarian', 'accountant')
          ) a ORDER BY a.role DESC
        `;
        const [rows] = await conn.execute(query, [student_id, student_id]);
        return rows;
    },

    getStudentLoginDetails: async (conn, student_id) => {
        const query = `
          SELECT users.* FROM users
          WHERE id IN (
            SELECT students.parent_id
            FROM users
            INNER JOIN students ON students.id = users.user_id
            WHERE users.user_id = ? AND users.role = 'student'
          )
          UNION
          SELECT users.*
          FROM users
          INNER JOIN students ON students.id = users.user_id
          WHERE users.user_id = ? AND users.role = 'student'
        `;
        const [rows] = await conn.execute(query, [student_id, student_id]);
        return rows;
    },

    getTeacherLoginDetails: async (conn, teacher_id) => {
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE user_id = ? AND role = ?',
            [teacher_id, 'teacher']
        );
        return rows.length > 0 ? rows : false;
    },

    getLibrarianLoginDetails: async (conn, librarian_id) => {
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE user_id = ? AND role = ?',
            [librarian_id, 'librarian']
        );
        return rows.length > 0 ? rows : false;
    },

    getAccountantLoginDetails: async (conn, accountant_id) => {
        const [rows] = await conn.execute(
            'SELECT * FROM users WHERE user_id = ? AND role = ?',
            [accountant_id, 'accountant']
        );
        return rows.length > 0 ? rows : false;
    },

    updateVerCode: async (conn, data) => {
        const [result] = await conn.execute(
            'UPDATE users SET ver_code = ? WHERE id = ?',
            [data.ver_code, data.id]
        );
        return result.affectedRows > 0;
    },
};

export default UserModel;