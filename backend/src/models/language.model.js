import { sqlPool } from "../config/database.js";

const LanguageFunctions = {
    async getClassLanguage(classId) {
        const [rows] = await sqlPool.query(
            `SELECT language FROM classes WHERE id = ?`,
            [classId]
        );
        return rows.length ? rows[0].language + "_" : "";
    },
};

export default LanguageFunctions;
