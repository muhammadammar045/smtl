// models/CmsPageContentModel.js

import db from "../db.js";

const CmsPageContentModel = {
    get: async (id = null) => {
        let sql = `SELECT * FROM front_cms_page_contents`;
        const params = [];

        if (id !== null) {
            sql += ` WHERE id = ?`;
            params.push(id);
        } else {
            sql += ` ORDER BY id`;
        }

        const [rows] = await db.query(sql, params);
        return id !== null ? rows[0] || null : rows;
    },

    getContentByPage: async (page_id) => {
        const [rows] = await db.query(
            `SELECT * FROM front_cms_page_contents WHERE page_id = ?`,
            [page_id]
        );
        return rows;
    },

    remove: async (id) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_page_contents WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    add: async (data) => {
        if (data.id) {
            const id = data.id;
            const { id: _, ...updateData } = data;
            const [result] = await db.query(
                `UPDATE front_cms_page_contents SET ? WHERE id = ?`,
                [updateData, id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_page_contents SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    batchInsert: async (data) => {
        const [result] = await db.query(
            `INSERT INTO front_cms_page_contents (page_id, content) VALUES ?`,
            [data.map(item => [item.page_id, item.content])]
        );
        return result.affectedRows > 0;
    },

    insertOrUpdate: async (data) => {
        const [rows] = await db.query(
            `SELECT * FROM front_cms_page_contents WHERE page_id = ?`,
            [data.page_id]
        );

        if (rows.length > 0) {
            const [result] = await db.query(
                `UPDATE front_cms_page_contents SET ? WHERE page_id = ?`,
                [data, data.page_id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_page_contents SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    deleteByPageID: async (page_id) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_page_contents WHERE page_id = ?`,
            [page_id]
        );
        return result.affectedRows > 0;
    }
};

export default CmsPageContentModel;
