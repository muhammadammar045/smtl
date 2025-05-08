// models/CmsMenuModel.js

import { db } from "../db/conn.js";

const CmsMenuModel = {
    get: async (id = null) => {
        let sql = `SELECT * FROM front_cms_menus`;
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

    add: async (data) => {
        if (data.id) {
            const id = data.id;
            const { id: _, ...updateData } = data;
            const [result] = await db.query(
                `UPDATE front_cms_menus SET ? WHERE id = ?`,
                [updateData, id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_menus SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    getBySlug: async (slug) => {
        const sql = `SELECT * FROM front_cms_menus WHERE slug = ? LIMIT 1`;
        const [rows] = await db.query(sql, [slug]);
        return rows[0] || null;
    },

    findMenuExists: async (menu) => {
        const sql = `SELECT * FROM front_cms_menus WHERE menu = ? LIMIT 1`;
        const [rows] = await db.query(sql, [menu]);
        return rows[0] || null;
    },

    checkDataExists: async (menu, id = 0) => {
        const sql = `SELECT COUNT(*) AS count FROM front_cms_menus WHERE menu = ? AND id != ?`;
        const [rows] = await db.query(sql, [menu, id]);
        return rows[0].count > 0;
    },

    removeBySlug: async (slug) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_menus WHERE slug = ?`,
            [slug]
        );
        return result.affectedRows > 0;
    },
};

export default CmsMenuModel;
