// models/EnquiryModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const EnquiryModel = {
    // Get all classes or a specific class by ID
    getClasses: async (id = null) => {
        let query = `SELECT * FROM classes`;
        if (id != null) {
            query += ` WHERE id = ?`;
            const [rows] = await db.query(query, [id]);
            return rows[0]; // Return the specific class
        } else {
            query += ` ORDER BY id`;
            const [rows] = await db.query(query);
            return rows; // Return all classes
        }
    },

    // Get all enquiry types
    getEnquiryType: async () => {
        const query = `SELECT * FROM enquiry_type`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Get all complaint sources
    getComplaintSource: async () => {
        const query = `SELECT * FROM source`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Get all complaint types
    getComplaintType: async () => {
        const query = `SELECT * FROM complaint_type`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Get all references
    getReference: async () => {
        const query = `SELECT * FROM reference`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Add a new enquiry
    add: async (data) => {
        const query = `INSERT INTO enquiry SET ?`;
        const [result] = await db.query(query, [data]);
        return result.insertId; // Return the insert ID
    },

    // Get a list of enquiries with optional filtering by ID and status
    getEnquiryList: async (id = null, status = 'active') => {
        let query = `
            SELECT enquiry.*, classes.class as classname, categories.category
            FROM enquiry
            LEFT JOIN classes ON enquiry.class = classes.id
            LEFT JOIN categories ON enquiry.program_applied_for = categories.id
            WHERE enquiry.status = ?`;

        const params = [status];

        if (id != null) {
            query += ` AND enquiry.id = ?`;
            params.push(id);
        }

        query += ` ORDER BY enquiry.id DESC`;

        const [rows] = await db.query(query, params);

        if (id != null) {
            return rows[0]; // Return specific enquiry if ID is provided
        } else {
            return rows; // Return all enquiries
        }
    },

    // Get the latest follow-up by enquiry ID
    getFollowByEnquiry: async (id) => {
        const query = `SELECT * FROM follow_up WHERE enquiry_id = ? ORDER BY id DESC LIMIT 1`;
        const [rows] = await db.query(query, [id]);
        return rows[0]; // Return the latest follow-up
    },

    // Get follow-up list for a specific enquiry
    getFollowUpList: async (enquiryId, followUpId = null) => {
        let query = `SELECT * FROM follow_up WHERE enquiry_id = ?`;
        const params = [enquiryId];

        if (followUpId != null) {
            query += ` AND id = ?`;
            params.push(followUpId);
        }

        query += ` ORDER BY id DESC`;

        const [rows] = await db.query(query, params);

        if (followUpId != null) {
            return rows[0]; // Return a specific follow-up if ID is provided
        } else {
            return rows; // Return all follow-ups
        }
    },

    // Add a new follow-up
    addFollowUp: async (data) => {
        const query = `INSERT INTO follow_up SET ?`;
        const [result] = await db.query(query, [data]);
        return result.insertId; // Return the insert ID
    },

    // Update an existing follow-up
    followUpUpdate: async (enquiryId, followUpId, data) => {
        const query = `UPDATE follow_up SET ? WHERE id = ? AND enquiry_id = ?`;
        await db.query(query, [data, followUpId, enquiryId]);
    },

    // Update enquiry details
    enquiryUpdate: async (id, data) => {
        const query = `UPDATE enquiry SET ? WHERE id = ?`;
        await db.query(query, [data, id]);
    },

    // Delete an enquiry by ID
    enquiryDelete: async (id) => {
        const query = `DELETE FROM enquiry WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Delete a follow-up by ID
    deleteFollowUp: async (id) => {
        const query = `DELETE FROM follow_up WHERE id = ?`;
        await db.query(query, [id]);
    },

    // Get the next follow-up date for a specific enquiry
    nextFollowUpDate: async (enquiryId) => {
        const query = `SELECT MAX(id) as id FROM follow_up WHERE enquiry_id = ?`;
        const [result] = await db.query(query, [enquiryId]);
        const followUpId = result.id;

        const queryFollowUp = `SELECT * FROM follow_up WHERE id = ?`;
        const [rows] = await db.query(queryFollowUp, [followUpId]);

        return rows;
    },

    // Change the status of an enquiry
    changeStatus: async (data) => {
        const query = `UPDATE enquiry SET ? WHERE id = ?`;
        await db.query(query, [data, data.id]);
    },

    // Search for enquiries based on source, status, and date range
    searchEnquiry: async (source, status = 'active', dateFrom, dateTo) => {
        let query = `SELECT enquiry.*, classes.class as classname
            FROM enquiry
            LEFT JOIN classes ON classes.id = enquiry.class
            WHERE enquiry.status = ?`;
        const params = [status];

        if (source) {
            query += ` AND source = ?`;
            params.push(source);
        }

        if (dateFrom && dateTo) {
            query += ` AND date >= ? AND date <= ?`;
            params.push(dateFrom, dateTo);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }
};

export default EnquiryModel;
