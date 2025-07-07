import { sqlPool } from "../config/database.js";

const GradesFunctions = {
    async getGradeList(campusId) {
        const [rows] = await sqlPool.query(
            `SELECT grades.*, campus.campus FROM grades 
            LEFT JOIN campus ON campus.id = grades.campus_id 
            WHERE grades.campus_id = ? ORDER BY campus.id`,
            [campusId]
        );
        return rows;
    },
};

export default GradesFunctions;
