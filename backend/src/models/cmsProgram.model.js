// models/CmsProgramModel.js

import { db } from "../db/conn.js";


const CmsProgramModel = {
    get: async (id = null) => {
        let sql = `SELECT * FROM front_cms_programs`;
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

    getByCategory: async (category = null, params = {}) => {
        let sql = `SELECT * FROM front_cms_programs WHERE type = ? ORDER BY created_at DESC`;
        const queryParams = [category];

        if (params.start && params.limit) {
            sql += ` LIMIT ?, ?`;
            queryParams.push(params.start, params.limit);
        } else if (params.limit) {
            sql += ` LIMIT ?`;
            queryParams.push(params.limit);
        }

        const [rows] = await db.query(sql, queryParams);
        return rows.length > 0 ? rows : false;
    },

    updateFeaturedImage: async (id, record_id) => {
        await db.beginTransaction();
        try {
            await db.query(
                `UPDATE front_cms_program_photos SET featured_img = 'yes' WHERE id = ?`,
                [record_id]
            );
            await db.query(
                `UPDATE front_cms_program_photos SET featured_img = 'no' WHERE id != ? AND program_id = ?`,
                [record_id, id]
            );
            await db.commitTransaction();
            return true;
        } catch (error) {
            await db.rollbackTransaction();
            return false;
        }
    },

    getBySlug: async (slug = null) => {
        const [rows] = await db.query(
            `SELECT * FROM front_cms_programs WHERE slug = ?`,
            [slug]
        );

        if (rows.length === 0) {
            return false;
        }

        const result = rows[0];
        result.page_contents = await CmsProgramModel.frontCmsProgramPhotos(result.id);
        return result;
    },

    frontCmsProgramPhotos: async (program_id) => {
        const [photos] = await db.query(
            `SELECT front_cms_media_gallery.* FROM front_cms_program_photos
       JOIN front_cms_media_gallery ON front_cms_program_photos.media_gallery_id = front_cms_media_gallery.id
       WHERE front_cms_program_photos.program_id = ?`,
            [program_id]
        );
        return photos;
    },

    remove: async (slug) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_programs WHERE slug = ?`,
            [slug]
        );
        return result.affectedRows > 0;
    },

    add: async (data) => {
        if (data.id) {
            const { id, ...updateData } = data;
            const [result] = await db.query(
                `UPDATE front_cms_programs SET ? WHERE id = ?`,
                [updateData, id]
            );
            return result.affectedRows > 0;
        } else {
            const [result] = await db.query(
                `INSERT INTO front_cms_programs SET ?`,
                [data]
            );
            return result.insertId;
        }
    },

    instBatch: async (data, contents) => {
        await db.beginTransaction();
        try {
            const [result] = await db.query(`INSERT INTO front_cms_programs SET ?`, [data]);
            const insert_id = result.insertId;

            if (contents && contents.length > 0) {
                contents.forEach((content) => {
                    content.program_id = insert_id;
                });
                await db.query(`INSERT INTO front_cms_program_photos (program_id, media_gallery_id, featured_img) VALUES ?`, [
                    contents.map(content => [content.program_id, content.media_gallery_id, content.featured_img])
                ]);
            }

            await db.commitTransaction();
            return true;
        } catch (error) {
            await db.rollbackTransaction();
            return false;
        }
    },

    updateBatch: async (data, contents, removeContent) => {
        await db.beginTransaction();
        try {
            await db.query(`UPDATE front_cms_programs SET ? WHERE id = ?`, [data, data.id]);

            if (removeContent && removeContent.length > 0) {
                await db.query(
                    `DELETE FROM front_cms_program_photos WHERE program_id = ? AND media_gallery_id IN (?)`,
                    [data.id, removeContent]
                );
            }

            if (contents && contents.length > 0) {
                contents.forEach((content) => {
                    content.program_id = data.id;
                });
                await db.query(
                    `INSERT INTO front_cms_program_photos (program_id, media_gallery_id, featured_img) VALUES ?`,
                    [contents.map(content => [content.program_id, content.media_gallery_id, content.featured_img])]
                );
            }

            await db.commitTransaction();
            return true;
        } catch (error) {
            await db.rollbackTransaction();
            return false;
        }
    },

    addImage: async (data) => {
        const [result] = await db.query(
            `INSERT INTO front_cms_program_photos SET ?`,
            [data]
        );
        return result.insertId;
    },

    removeImage: async (id) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_program_photos WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    removeBySlug: async (slug, type) => {
        const [result] = await db.query(
            `DELETE FROM front_cms_programs WHERE slug = ? AND type = ?`,
            [slug, type]
        );
        return result.affectedRows > 0;
    },

    banner: async (bannerContent, data) => {
        await db.beginTransaction();
        try {
            const [bannerContentRecord] = await CmsProgramModel.getByCategory(bannerContent);

            if (bannerContentRecord) {
                data.program_id = bannerContentRecord[0].id;
                await db.query(
                    `INSERT INTO front_cms_program_photos (program_id, media_gallery_id, featured_img) VALUES (?, ?, ?)`,
                    [data.program_id, data.media_gallery_id, data.featured_img]
                );
            } else {
                const programData = { type: bannerContent, title: "Banner Images" };
                const insertProgramId = await CmsProgramModel.add(programData);
                data.program_id = insertProgramId;
                await db.query(
                    `INSERT INTO front_cms_program_photos (program_id, media_gallery_id, featured_img) VALUES (?, ?, ?)`,
                    [data.program_id, data.media_gallery_id, data.featured_img]
                );
            }

            await db.commitTransaction();
            return true;
        } catch (error) {
            await db.rollbackTransaction();
            return false;
        }
    },

    bannerDelete: async (bannerContent, mediaGalleryId) => {
        await db.beginTransaction();
        try {
            const [bannerContentRecord] = await CmsProgramModel.getByCategory(bannerContent);

            if (bannerContentRecord) {
                const data = { program_id: bannerContentRecord[0].id, media_gallery_id: mediaGalleryId };
                await db.query(
                    `DELETE FROM front_cms_program_photos WHERE program_id = ? AND media_gallery_id = ?`,
                    [data.program_id, data.media_gallery_id]
                );
            }

            await db.commitTransaction();
            return true;
        } catch (error) {
            await db.rollbackTransaction();
            return false;
        }
    }
};

export default CmsProgramModel;
