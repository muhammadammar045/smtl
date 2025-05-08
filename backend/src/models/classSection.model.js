// models/ClassSectionModel.js

import { db } from "../db/conn.js";

const ClassSectionModel = {
    get: async (classId) => {
        const [rows] = await db.query(
            `SELECT class_sections.id, class_sections.section_id, sections.section
       FROM class_sections
       JOIN sections ON sections.id = class_sections.section_id
       WHERE class_sections.class_id = ?
       ORDER BY class_sections.id`,
            [classId]
        );
        return rows;
    },

    getClassInfo: async (classId) => {
        const [rows] = await db.query(
            `SELECT * FROM classes WHERE id = ?`,
            [classId]
        );
        return rows[0] || null;
    },

    update: async (data) => {
        if (data.id) {
            const id = data.id;
            delete data.id;
            const [result] = await db.query(
                `UPDATE classes SET ? WHERE id = ?`,
                [data, id]
            );
            return result;
        }
    },

    add: async (data, sections) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            let classId;
            if (data.id) {
                const id = data.id;
                delete data.id;
                await connection.query(`UPDATE classes SET ? WHERE id = ?`, [data, id]);
                classId = id;
            } else {
                const [insertResult] = await connection.query(`INSERT INTO classes SET ?`, [data]);
                classId = insertResult.insertId;
            }

            const sectionRows = sections.map((sectionId) => [classId, sectionId]);
            await connection.query(
                `INSERT INTO class_sections (class_id, section_id) VALUES ?`,
                [sectionRows]
            );

            await connection.commit();
            return { success: true, classId };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getDetailByClassSection: async (classId, sectionId) => {
        const [rows] = await db.query(
            `SELECT class_sections.*, classes.class, sections.section
       FROM class_sections
       JOIN classes ON classes.id = class_sections.class_id
       JOIN sections ON sections.id = class_sections.section_id
       WHERE class_sections.class_id = ? AND class_sections.section_id = ?`,
            [classId, sectionId]
        );
        return rows[0] || null;
    },

    checkDataExists: async ({ class_id, section_id }) => {
        const [rows] = await db.query(
            `SELECT id FROM class_sections WHERE class_id = ? AND section_id = ?`,
            [class_id, section_id]
        );
        return rows.length > 0;
    },

    getByID: async (id = null) => {
        const query = `
      SELECT classes.*, campus.campus
      FROM classes
      JOIN campus ON campus.id = classes.campus_id
      ${id ? "WHERE classes.id = ?" : "ORDER BY classes.id DESC"}
    `;

        const [rows] = await db.query(query, id ? [id] : []);
        const result = [];

        for (const row of rows) {
            const vehicles = await ClassSectionModel.getVechileByRoute(row.id);
            result.push(
                id
                    ? {
                        id: row.id,
                        playlist_id: row.playlist_id,
                        route_id: row.class,
                        campus_id: row.campus_id,
                        campus_name: row.campus,
                        zoom_api_key: row.zoom_api_key,
                        zoom_secret_key: row.zoom_secret_key,
                        vehicles,
                    }
                    : {
                        id: row.id,
                        class: row.class,
                        playlist_id: row.playlist_id,
                        campus_name: row.campus,
                        vehicles,
                    }
            );
        }

        return result;
    },

    getVechileByRoute: async (routeId) => {
        const [rows] = await db.query(
            `SELECT class_sections.id AS class_section_id, class_sections.class_id,
              class_sections.section_id, sections.*
       FROM class_sections
       JOIN sections ON sections.id = class_sections.section_id
       WHERE class_sections.class_id = ?
       ORDER BY sections.section_order ASC`,
            [routeId]
        );
        return rows;
    },

    remove: async (classId, sectionIds) => {
        if (sectionIds.length === 0) return;
        const placeholders = sectionIds.map(() => '?').join(', ');
        const [result] = await db.query(
            `DELETE FROM class_sections WHERE class_id = ? AND section_id IN (${placeholders})`,
            [classId, ...sectionIds]
        );
        return result;
    },
};

export default ClassSectionModel;
