// models/CmsMediaModel.js

import { db } from "../db/conn.js";

const CmsMediaModel = {
    bulkAdd: async (data) => {
        if (!Array.isArray(data) || data.length === 0) return false;

        const keys = Object.keys(data[0]);
        const values = data.map(item => keys.map(k => item[k]));

        const placeholders = data.map(() => `(${keys.map(() => "?").join(", ")})`).join(", ");
        const sql = `INSERT INTO front_cms_media_gallery (${keys.join(", ")}) VALUES ${placeholders}`;

        const flatValues = values.flat();
        const [result] = await db.query(sql, flatValues);
        return result.affectedRows > 0;
    },

    add: async (data) => {
        const [result] = await db.query(
            `INSERT INTO front_cms_media_gallery SET ?`,
            [data]
        );
        return result.insertId;
    },

    get: async (id = null) => {
        let sql = `SELECT * FROM front_cms_media_gallery`;
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

    getSlug: async (slug) => {
        const sql = `
      SELECT img_name
      FROM front_cms_media_gallery
      WHERE img_name = ? OR img_name REGEXP CONCAT('^', ?, '-[0-9]+$')
      ORDER BY LENGTH(img_name), img_name DESC
      LIMIT 1
    `;
        const [rows] = await db.query(sql, [slug, slug]);
        return rows.length;
    },

    remove: async (id) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_media_gallery WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    countAll: async (searchText = "", mediaType = "") => {
        const sql = `
      SELECT COUNT(*) AS total
      FROM front_cms_media_gallery
      WHERE img_name LIKE ? AND file_type LIKE ?
    `;
        const [rows] = await db.query(sql, [`%${searchText}%`, `%${mediaType}%`]);
        return rows[0]?.total || 0;
    },

    fetchDetails: async (limit, start, searchText = "img", mediaType = "") => {
        const sql = `
      SELECT *
      FROM front_cms_media_gallery
      WHERE img_name LIKE ? AND file_type LIKE ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
        const [rows] = await db.query(sql, [`%${searchText}%`, `%${mediaType}%`, limit, start]);
        return rows;
    },
};

export default CmsMediaModel;
