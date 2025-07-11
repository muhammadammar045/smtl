import { sqlPool } from "../config/database.js";

const SettingFunctions = {
    async getSchoolSettings() {
        const [settingsRows] = await sqlPool.query(`
        SELECT sch_settings.*, sessions.session, languages.language
        FROM sch_settings
        JOIN sessions ON sessions.id = sch_settings.session_id
        JOIN languages ON languages.id = sch_settings.lang_id
        ORDER BY sch_settings.id LIMIT 1
    `);
        return settingsRows[0];
    },
    async getFullSettings(campusId) {
        const [rows] = await sqlPool.query(
            `
            SELECT sch_settings.*, languages.language, sessions.session
            FROM sch_settings
            JOIN sessions ON sessions.id = sch_settings.session_id
            JOIN languages ON languages.id = sch_settings.lang_id
            WHERE sch_settings.campus_id = ?
            ORDER BY sch_settings.id LIMIT 1`,
            [campusId]
        );
        return rows[0];
    },
};

export default SettingFunctions;
