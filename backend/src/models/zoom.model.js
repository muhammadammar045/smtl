import { sqlPool } from "../config/database.js";

const ZoomFunctions = {
    async getZoomCredentials(classId) {
        const sql = `SELECT zoom_api_key, zoom_secret_key FROM classes WHERE id = ?`;
        const [rows] = await sqlPool.query(sql, [classId]);
        return rows[0];
    },
    async getGlobalSettings() {
        const sql = `SELECT * FROM zoom_settings ORDER BY id LIMIT 1`;
        const [rows] = await sqlPool.query(sql);
        return rows[0];
    },
};

export default ZoomFunctions;
