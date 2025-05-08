// models/CmsMenuItemsModel.js

import { db } from "../db/conn.js";

const CmsMenuItemsModel = {
    get: async (id = null) => {
        let sql = `SELECT * FROM front_cms_menu_items`;
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

    getBySlug: async (slug) => {
        const [rows] = await db.query(
            `SELECT * FROM front_cms_menu_items WHERE slug = ? LIMIT 1`,
            [slug]
        );
        return rows[0] || null;
    },

    removeBySlug: async (slug) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_menu_items WHERE slug = ?`,
            [slug]
        );
        return result.affectedRows > 0;
    },

    remove: async (id) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.query(
                `DELETE FROM front_cms_menu_items WHERE id = ?`,
                [id]
            );
            await conn.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await conn.rollback();
            return false;
        } finally {
            conn.release();
        }
    },

    add: async (data) => {
        if (data.id) {
            const id = data.id;
            const { id: _, ...updateData } = data;
            const [result] = await db.query(
                `UPDATE front_cms_menu_items SET ? WHERE id = ?`,
                [updateData, id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_menu_items SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    getMenus: async (menu_id) => {
        const sql = `
      SELECT 
        i.*, 
        p.slug AS page_slug, 
        p.url AS page_url, 
        p.is_homepage 
      FROM front_cms_menu_items i
      LEFT JOIN front_cms_pages p ON p.id = i.page_id
      WHERE i.menu_id = ?
      ORDER BY i.parent_id ASC, i.weight ASC
    `;
        const [rows] = await db.query(sql, [menu_id]);

        const parentMenu = {};
        const subMenu = {};

        for (const obj of rows) {
            const item = {
                id: obj.id,
                parent: obj.parent_id,
                page_id: obj.page_id,
                ext_url: obj.ext_url,
                ext_url_link: obj.ext_url_link,
                open_new_tab: obj.open_new_tab,
                publish: obj.publish,
                label: obj.menu,
                link: obj.slug,
                page_slug: obj.page_slug,
                page_url: obj.page_url,
                is_homepage: obj.is_homepage,
            };

            if (obj.parent_id === 0) {
                parentMenu[obj.id] = item;
            } else {
                subMenu[obj.id] = item;
            }
        }

        return CmsMenuItemsModel._dynMenu(parentMenu, subMenu);
    },

    _dynMenu: (parentArray, subArray) => {
        const result = {};

        for (const [pkey, pval] of Object.entries(parentArray)) {
            result[pkey] = {
                ...pval,
                slug: pval.link,
                menu: pval.label,
                submenus: [],
            };

            for (const sval of Object.values(subArray)) {
                if (sval.parent === parseInt(pkey)) {
                    result[pkey].submenus.push({
                        ...sval,
                        slug: sval.link,
                        menu: sval.label,
                    });
                }
            }
        }

        return result;
    },
};

export default CmsMenuItemsModel;
