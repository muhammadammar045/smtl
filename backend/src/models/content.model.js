// models/ContentModel.js

import { db } from "../db/conn.js"; // Assuming db connection is set up

const ContentModel = {
    currentSession: async () => {
        const [rows] = await db.query("SELECT * FROM settings WHERE setting_key = 'current_session'");
        return rows[0].setting_value;
    },

    get: async (id = null) => {
        let query = `
            SELECT contents.*, classes.class, sections.section,
                (SELECT GROUP_CONCAT(role) FROM content_for WHERE content_id = contents.id) AS role,
                class_sections.id AS aa
            FROM contents
            LEFT JOIN class_sections ON contents.cls_sec_id = class_sections.id
            LEFT JOIN classes ON class_sections.class_id = classes.id
            LEFT JOIN sections ON class_sections.section_id = sections.id
        `;
        const params = [];
        if (id) {
            query += " WHERE contents.id = ?";
            params.push(id);
        }
        query += " ORDER BY contents.id DESC LIMIT 10";

        const [rows] = await db.query(query, params);
        return id ? rows[0] : rows;
    },

    getContentByRole: async (id = null, role = null) => {
        const query = `
            SELECT contents.*, 
                (SELECT GROUP_CONCAT(role) FROM content_for WHERE content_id = contents.id) AS role,
                class_sections.id AS class_section_id, classes.class, sections.section
            FROM content_for
            INNER JOIN contents ON contents.id = content_for.content_id
            LEFT JOIN class_sections ON class_sections.id = contents.cls_sec_id
            LEFT JOIN classes ON classes.id = class_sections.class_id
            LEFT JOIN sections ON sections.id = class_sections.section_id
            WHERE (role = 'student' AND created_by = ?) OR (created_by = 0 AND role = ?)
            GROUP BY contents.id
        `;
        const [rows] = await db.query(query, [id, role]);
        return rows;
    },

    getContentByRole2: async (id = null, role = null, campus_id = null) => {
        const query = `
            SELECT campus.campus, contents.*, 
                (SELECT GROUP_CONCAT(role) FROM content_for WHERE content_id = contents.id) AS role,
                class_sections.id AS class_section_id, classes.class, sections.section
            FROM content_for
            INNER JOIN contents ON contents.id = content_for.content_id
            LEFT JOIN class_sections ON class_sections.id = contents.cls_sec_id
            LEFT JOIN classes ON classes.id = content_sections.class_id
            LEFT JOIN sections ON sections.id = content_sections.section_id
            LEFT JOIN campus ON campus.id = contents.campus_id
            WHERE (role = 'student' AND created_by = ?) OR (created_by = 0)
            AND FIND_IN_SET(contents.campus_id, ?)
            GROUP BY contents.id
            ORDER BY contents.date DESC
        `;
        const [rows] = await db.query(query, [id, campus_id]);
        return rows;
    },

    getListByCategory: async (category, campus_id) => {
        const query = `
            SELECT contents.*, classes.class, campus.campus
            FROM contents
            LEFT JOIN classes ON contents.class_id = classes.id
            LEFT JOIN campus ON campus.id = contents.campus_id
            WHERE contents.type = ? AND FIND_IN_SET(contents.campus_id, ?)
            ORDER BY contents.id
        `;
        const [rows] = await db.query(query, [category, campus_id]);
        return rows;
    },

    getListByCategoryForUser: async (class_id, section_id, category = '', campus_id) => {
        if (!class_id) {
            class_id = "0";
        }

        if (!section_id) {
            section_id = "0";
        }

        const query = `
            SELECT contents.*, class_sections.id AS class_section_id, classes.class, sections.section
            FROM content_for
            INNER JOIN contents ON content_for.content_id = contents.id
            LEFT JOIN class_sections ON class_sections.id = contents.cls_sec_id
            LEFT JOIN classes ON classes.id = class_sections.class_id
            LEFT JOIN sections ON sections.id = class_sections.section_id
            WHERE (role = 'student' AND contents.type = ? AND contents.is_public = 'yes' AND contents.campus_id = ?)
            OR (contents.class_id = ? AND contents.cls_sec_id = ? AND role = 'student' AND contents.type = ? AND contents.campus_id = ?)
        `;
        const [rows] = await db.query(query, [category, campus_id, class_id, section_id, category, campus_id]);
        return rows;
    },

    remove: async (id) => {
        await db.query("DELETE FROM contents WHERE id = ?", [id]);
    },

    searchByContentType: async (text) => {
        const [rows] = await db.query("SELECT * FROM contents WHERE content_type LIKE ?", [`%${text}%`]);
        return rows;
    },

    add: async (data, content_role = []) => {
        if (data.id) {
            await db.query("UPDATE contents SET ? WHERE id = ?", [data, data.id]);
        } else {
            const [result] = await db.query("INSERT INTO contents SET ?", [data]);
            const insertId = result.insertId;

            if (content_role.length) {
                for (let i = 0; i < content_role.length; i++) {
                    content_role[i].content_id = insertId;
                }
                await db.query("INSERT INTO content_for (content_id, role, created_by) VALUES ?", [content_role.map(item => [item.content_id, item.role, item.created_by])]);
            }

            return insertId;
        }
    }
};

export default ContentModel;
