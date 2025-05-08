// models/EmailConfigModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const EmailConfigModel = {
    // Get all email config records
    get: async () => {
        const query = `SELECT * FROM email_config ORDER BY id`;
        const [rows] = await db.query(query);
        return rows[0]; // Return the first row
    },

    // Get email config by email type
    getEmailByType: async (emailType) => {
        const query = `SELECT * FROM email_config WHERE email_type = ?`;
        const [rows] = await db.query(query, [emailType]);
        return rows[0]; // Return the row matching the email type
    },

    // Update email config by email type
    updateEmailConfig: async (emailType, data) => {
        const query = `UPDATE email_config SET smtp_username = ?, smtp_password = ? WHERE email_type = ?`;
        await db.query(query, [data.smtp_username, data.smtp_password, emailType]);
    },

    // Add or update email config
    add: async (data) => {
        const query = `SELECT * FROM email_config`;
        const [rows] = await db.query(query);

        if (rows.length > 0) {
            const queryUpdate = `UPDATE email_config SET ? WHERE id = ?`;
            await db.query(queryUpdate, [data, rows[0].id]);
        } else {
            const queryInsert = `INSERT INTO email_config SET ?`;
            const [result] = await db.query(queryInsert, [data]);
            return result.insertId; // Return the insert ID
        }
    },

    // Get the active email configuration
    getActiveEmail: async () => {
        const query = `SELECT * FROM email_config WHERE is_active = 'yes'`;
        const [rows] = await db.query(query);
        return rows[0]; // Return the active email config
    }
};

export default EmailConfigModel;
