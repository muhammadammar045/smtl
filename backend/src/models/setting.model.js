import { sqlPool } from "../config/database.js";

const SettingFunctions = {
    async getSettings(id = null, campus_id = null, session) {
        let query = `
      SELECT 
        sch_settings.branch_code, sch_settings.branch_name, sch_settings.passing_percentage,
        sch_settings.num_subject_fail, sch_settings.school_city, sch_settings.start_of_session,
        sch_settings.result_template, sch_settings.due_school_fine, sch_settings.due_school_days,
        sch_settings.signature, sch_settings.attendance_num, sch_settings.id, sch_settings.campus_id,
        sch_settings.lang_id, sch_settings.class_teacher, sch_settings.is_rtl,
        sch_settings.cron_secret_key, sch_settings.timezone, sch_settings.name, sch_settings.email,
        sch_settings.phone, languages.language, sch_settings.parent_signature,
        sch_settings.principal_signature, sch_settings.address, sch_settings.dise_code,
        sch_settings.fee_system, sch_settings.discipline1, sch_settings.bank_account_1,
        sch_settings.bank_account_1_name, sch_settings.bank_account_1_title,
        sch_settings.bank_account_2, sch_settings.bank_account_2_name,
        sch_settings.bank_account_2_title, sch_settings.online_admission,
        sch_settings.discipline2, sch_settings.start_month_session, sch_settings.end_month_session,
        sch_settings.date_format, sch_settings.autogen_number, sch_settings.addmission_prefix_number,
        sch_settings.addmission_prefix, sch_settings.currency, sch_settings.currency_symbol,
        sch_settings.start_month, sch_settings.session_id, sch_settings.fee_due_days,
        sch_settings.image, sch_settings.theme, sessions.session
      FROM sch_settings
      INNER JOIN sessions ON sessions.id = sch_settings.session_id
      INNER JOIN languages ON languages.id = sch_settings.lang_id
    `;

        const params = [];

        if (campus_id) {
            query += ` WHERE sch_settings.campus_id = ?`;
            params.push(campus_id);
        }

        if (id) {
            query += campus_id
                ? ` AND sch_settings.id = ?`
                : ` WHERE sch_settings.id = ?`;
            params.push(id);
        } else {
            query += ` ORDER BY sch_settings.id`;
        }

        const [rows] = await sqlPool.execute(query, params);

        if (id) {
            // Return single record
            return rows[0] || null;
        } else {
            if (rows.length === 0) return [];

            // Add default current_session to first item
            rows[0].current_session = {
                session_id: rows[0].session_id,
                session: rows[0].session,
            };

            // Overwrite if session has custom session_array
            if (session?.session_array) {
                rows[0].session_id = session.session_array.session_id;
                rows[0].session = session.session_array.session;
            }

            return rows[0];
        }
    },

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
