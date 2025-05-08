// models/CronModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const CronModel = {
    cronSearch: async () => {
        const query = `
            SELECT s.id AS g_id, s.guardian_email, s.guardian_name, s.firstname, s.guardian_phone, fgt.*, ft.type
            FROM students s
            LEFT JOIN student_session ss ON s.id = ss.student_id
            LEFT JOIN classes cl ON ss.class_id = cl.id
            LEFT JOIN sections se ON ss.section_id = se.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN student_fees_master sfm ON ss.student_id = sfm.student_session_id
            LEFT JOIN student_fees_deposite sfd ON sfm.student_session_id = sfd.student_fees_master_id
            LEFT JOIN fee_groups gr ON sfm.student_session_id = gr.id
            LEFT JOIN fee_groups_feetype fgt ON gr.id = fgt.fee_session_group_id
            LEFT JOIN feetype ft ON ft.id = fgt.feetype_id
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    cronSearch2: async () => {
        const query = `
            SELECT s.id AS g_id, s.guardian_email, s.guardian_name, s.firstname, s.guardian_phone, fgt.*, ft.type
            FROM students s
            LEFT JOIN student_session ss ON s.id = ss.student_id
            LEFT JOIN classes cl ON ss.class_id = cl.id
            LEFT JOIN sections se ON ss.section_id = se.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN student_fees_master sfm ON ss.id = sfm.student_session_id
            LEFT JOIN student_fees_deposite sfd ON sfm.id = sfd.student_fees_master_id
            LEFT JOIN fee_groups gr ON sfm.fee_session_group_id = gr.id
            LEFT JOIN fee_groups_feetype fgt ON gr.id = fgt.id
            LEFT JOIN feetype ft ON ft.id = fgt.feetype_id
            LEFT JOIN due_extension_requests des ON sfm.id = des.fee_master_id AND sfm.student_session_id = des.student_id
            WHERE des.status = 'approved'
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    extensionReqCheck: async (id) => {
        const query = `
            SELECT id
            FROM due_extension_requests
            WHERE student_id = ? AND status = 'approved'
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0]; // Return first row (if exists)
    }
};

export default CronModel;
