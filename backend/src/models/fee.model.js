import { sqlPool } from "../config/database.js";

const FeeFunctions = {
    async getFeeSystemSetting(campusId) {
        const [rows] = await sqlPool.query(
            `SELECT fee_system, start_month_session, end_month_session FROM sch_settings 
            WHERE campus_id = ? LIMIT 1`,
            [campusId]
        );
        return rows[0];
    },

    async getStudentFeeDiscounts(studentSessionId) {
        const [rows] = await sqlPool.query(
            `SELECT sfd.id, sfd.student_session_id, sfd.status, sfd.payment_id, 
                sfd.description AS student_fees_discount_description,
                sfd.fees_discount_id, fd.name, fd.code, fd.amount, fd.description, fd.session_id
                FROM student_fees_discounts sfd
                JOIN fees_discounts fd ON fd.id = sfd.fees_discount_id
                WHERE sfd.student_session_id = ?
                ORDER BY sfd.id`,
            [studentSessionId]
        );
        return rows;
    },

    async getStudentDueFees(studentSessionId, isSchool) {
        if (isSchool) {
            const [rows] = await sqlPool.query(
                `
            SELECT 
                sfm.*, 
                sfmh.id AS child_id, 
                ss.class_id, 
                c.class AS name
            FROM student_fees_master sfm
            INNER JOIN student_session ss ON sfm.student_session_id = ss.id
            INNER JOIN classes c ON c.id = ss.class_id
            INNER JOIN student_fees_master_heads sfmh ON sfm.id = sfmh.feemaster_parent_id
            WHERE sfm.student_session_id = ?
            ORDER BY sfm.fee_master_due`,
                [studentSessionId]
            );
            return rows;
        } else {
            const [rows] = await sqlPool.query(
                `
            SELECT 
                sfm.*, 
                ss.class_id, 
                c.class AS name
            FROM student_fees_master sfm
            INNER JOIN student_session ss ON sfm.student_session_id = ss.id
            INNER JOIN classes c ON c.id = ss.class_id
            WHERE sfm.student_session_id = ?
            ORDER BY sfm.id`,
                [studentSessionId]
            );
            return rows;
        }
    },
};

export default FeeFunctions;
