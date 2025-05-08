// models/DepartmentModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const DepartmentModel = {
    // Validates whether a department with a given name already exists
    validDepartment: async (str) => {
        const type = str; // Assuming the value passed as `str` is the department type
        const id = str.departmenttypeid || 0;

        if (await DepartmentModel.checkDepartmentExists(type, id)) {
            throw new Error('Record already exists');
        } else {
            return true;
        }
    },

    // Checks if the department already exists with the given name
    checkDepartmentExists: async (name, id) => {
        let query = '';
        if (id !== 0) {
            query = `
                SELECT 1
                FROM department
                WHERE id != ? AND department_name = ?
            `;
            const [rows] = await db.query(query, [id, name]);
            return rows.length > 0;
        } else {
            query = `
                SELECT 1
                FROM department
                WHERE department_name = ?
            `;
            const [rows] = await db.query(query, [name]);
            return rows.length > 0;
        }
    },

    // Deletes a department by its id
    deleteDepartment: async (id) => {
        const query = `DELETE FROM department WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Fetches department information by id or all departments if no id is provided
    getDepartmentType: async (id = null) => {
        let query = '';
        if (id) {
            query = `SELECT * FROM department WHERE id = ?`;
            const [rows] = await db.query(query, [id]);
            return rows[0]; // Returns the first department if found
        } else {
            query = `SELECT * FROM department`;
            const [rows] = await db.query(query);
            return rows; // Returns all departments
        }
    },

    // Adds or updates a department type
    addDepartmentType: async (data) => {
        if (data.id) {
            const query = `
                UPDATE department
                SET department_name = ?, other_column = ?
                WHERE id = ?
            `;
            await db.query(query, [data.department_name, data.other_column, data.id]);
            return data.id;
        } else {
            const query = `INSERT INTO department (department_name, other_column) VALUES (?, ?)`;
            const [result] = await db.query(query, [data.department_name, data.other_column]);
            return result.insertId;
        }
    }
};

export default DepartmentModel;
