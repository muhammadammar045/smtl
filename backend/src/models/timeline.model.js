import { sqlPool } from "../config/database.js";

const TimelineFunctions = {
    async getTimeline(studentId) {
        const [rows] = await sqlPool.query(
            `SELECT * FROM student_timeline WHERE student_id = ? AND status = 'yes' ORDER BY timeline_date ASC`,
            [studentId]
        );
        return rows;
    },
};

export default TimelineFunctions;
