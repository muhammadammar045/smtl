// models/CmsPageModel.js

import { db } from "../db/conn.js";
import CmsPageContentModel from "./cmsPageContent.model.js";

const CmsPageModel = {
    get: async (id = null) => {
        let sql = `SELECT front_cms_pages.*, front_cms_page_contents.content_type
               FROM front_cms_pages
               LEFT JOIN front_cms_page_contents ON front_cms_pages.id = front_cms_page_contents.page_id`;
        const params = [];

        if (id !== null) {
            sql += ` WHERE front_cms_pages.id = ?`;
            params.push(id);
        } else {
            sql += ` ORDER BY front_cms_pages.id`;
        }

        const [rows] = await db.query(sql, params);
        return id !== null ? rows[0] || null : rows;
    },

    getBySlug: async (slug = null) => {
        const [rows] = await db.query(
            `SELECT * FROM front_cms_pages WHERE slug = ?`,
            [slug]
        );

        if (rows.length <= 0) {
            return false;
        }

        const result = rows[0];
        result.category_content = await CmsPageModel.getPageCategoryContent(result.id);
        return result;
    },

    getPageCategoryContent: async (page_id) => {
        const content = await CmsPageContentModel.getContentByPage(page_id);
        const contentResult = {};
        content.forEach((contentItem) => {
            contentResult[contentItem.content_type] = contentItem.content_type;
        });
        return contentResult;
    },

    remove: async (id) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_pages WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    removeBySlug: async (slug) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_pages WHERE slug = ?`,
            [slug]
        );
        return result.affectedRows > 0;
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...updateData } = data;
            const [result] = await db.query(
                `UPDATE front_cms_pages SET ? WHERE id = ?`,
                [updateData, id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_pages SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    validCheckExists: async (url, id = 0) => {
        const [rows] = await db.query(
            `SELECT 1 FROM front_cms_pages WHERE url = ? AND id != ?`,
            [url, id]
        );
        return rows.length > 0;
    }
};

export default CmsPageModel;
