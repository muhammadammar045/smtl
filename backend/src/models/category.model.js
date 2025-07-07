import { sqlPool } from "../config/database.js";

const CategoryFunctions = {
    async getCategoryList() {
        const [rows] = await sqlPool.query(
            `SELECT * FROM categories ORDER BY id`
        );
        return rows;
    },
};

export default CategoryFunctions;
