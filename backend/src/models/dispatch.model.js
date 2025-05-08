// models/DispatchModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const DispatchModel = {
    // Insert a new record into the specified table
    insert: async (table, data) => {
        const query = `INSERT INTO ${table} SET ?`;
        const [result] = await db.query(query, [data]);
        return result.insertId; // Return the insert ID
    },

    // Update an image for a specific dispatch based on type and dispatch_id
    imageAdd: async (type, dispatchId, image) => {
        const query = `
            UPDATE dispatch_receive 
            SET image = ? 
            WHERE id = ? AND type = ?
        `;
        await db.query(query, [image, dispatchId, type]);
    },

    // Get a list of dispatch records
    dispatchList: async () => {
        const query = `SELECT * FROM dispatch_receive WHERE type = 'dispatch' ORDER BY id DESC`;
        const [rows] = await db.query(query);
        return rows; // Return list of dispatch records
    },

    // Get a list of receive records
    receiveList: async () => {
        const query = `SELECT * FROM dispatch_receive WHERE type = 'receive' ORDER BY id DESC`;
        const [rows] = await db.query(query);
        return rows; // Return list of receive records
    },

    // Get dispatch/receive record by id and type
    disRecData: async (id, type) => {
        const query = `
            SELECT * FROM dispatch_receive 
            WHERE id = ? AND type = ?
        `;
        const [rows] = await db.query(query, [id, type]);
        return rows[0]; // Return the single record
    },

    // Update dispatch record based on id and type
    updateDispatch: async (table, id, type, data) => {
        const query = `
            UPDATE ${table} 
            SET ? 
            WHERE id = ? AND type = ?
        `;
        await db.query(query, [data, id, type]);
    },

    // Update the image for a specific dispatch/receive record
    imageUpdate: async (type, id, imgName) => {
        const query = `
            UPDATE dispatch_receive 
            SET image = ? 
            WHERE id = ? AND type = ?
        `;
        await db.query(query, [imgName, id, type]);
    },

    // Delete the image and dispatch/receive record
    imageDelete: async (id, imgName) => {
        const fs = require("fs");
        const filePath = `./uploads/front_office/dispatch_receive/${imgName}`;

        // Delete the image from the file system
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const query = `DELETE FROM dispatch_receive WHERE id = ?`;
        await db.query(query, [id]);

        return true; // Return success after deletion
    },

    // Delete dispatch/receive record by id
    delete: async (id) => {
        const query = `DELETE FROM dispatch_receive WHERE id = ?`;
        await db.query(query, [id]);

        return true; // Return success after deletion
    }
};

export default DispatchModel;
