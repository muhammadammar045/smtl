import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a MySQL connection pool
const sqlPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test_db",
});

// Test the connection
const ConnectToDb = async () => {
    try {
        await sqlPool.getConnection();
        console.log(
            "✅ Database connection has been established successfully."
        );
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};
export { sqlPool, ConnectToDb };
