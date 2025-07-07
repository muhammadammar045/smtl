import { sqlPool } from "../config/database.js";

const NotificationFunctions = {
    async getNotificationForStudent(studentId, campusId) {
        const [rows] = await sqlPool.query(
            `
            SELECT
                sn.id,
                sn.title,
                sn.publish_date,
                sn.date,
                sn.message,
                IF(rn.id IS NULL, 'unread', 'read') AS notification_id
            FROM send_notification sn
            LEFT JOIN read_notification rn 
                ON sn.id = rn.notification_id 
                AND rn.student_id = ?
            WHERE sn.visible_student = 'Yes'
              AND sn.campus_id = ?
            ORDER BY sn.publish_date DESC
            `,
            [studentId, campusId]
        );

        return rows;
    },
};

export default NotificationFunctions;
