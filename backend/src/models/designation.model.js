// models/DesignationModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const DesignationModel = {
    // Fetches designation(s) based on the id, or fetches active designations if no id is provided
    get: async (id = null) => {
        let query = '';
        if (id) {
            query = `SELECT * FROM staff_designation WHERE id = ?`;
            const [rows] = await db.query(query, [id]);
            return rows[0]; // Returns the first row if id is found
        } else {
            query = `SELECT * FROM staff_designation WHERE is_active = 'yes'`;
            const [rows] = await db.query(query);
            return rows; // Returns all active designations
        }
    },

    // Validates whether a designation with a given name already exists
    validDesignation: async () => {
        const type = "your_input_value"; // Placeholder for type input
        const id = "your_input_value";   // Placeholder for designationid input
        if (await DesignationModel.checkDesignationExists(type, id)) {
            throw new Error('Record already exists');
        } else {
            return true;
        }
    },

    // Checks if a designation already exists with the given name
    checkDesignationExists: async (name, id) => {
        let query = '';
        if (id !== 0) {
            query = `
                SELECT 1
                FROM staff_designation
                WHERE id != ? AND designation = ?
            `;
            const [rows] = await db.query(query, [id, name]);
            return rows.length > 0;
        } else {
            query = `
                SELECT 1
                FROM staff_designation
                WHERE designation = ?
            `;
            const [rows] = await db.query(query, [name]);
            return rows.length > 0;
        }
    },

    // Deletes a designation by its id
    deleteDesignation: async (id) => {
        const query = `DELETE FROM staff_designation WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Adds or updates a designation
    addDesignation: async (data) => {
        if (data.id) {
            const query = `
                UPDATE staff_designation
                SET designation = ?, is_active = ?
                WHERE id = ?
            `;
            await db.query(query, [data.designation, data.is_active, data.id]);
        } else {
            const query = `INSERT INTO staff_designation (designation, is_active) VALUES (?, ?)`;
            await db.query(query, [data.designation, data.is_active]);
        }
    }
};

export default DesignationModel;
