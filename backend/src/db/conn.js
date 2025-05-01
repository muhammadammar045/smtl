import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const ConnectToDb = async () => {
    try {
        const connection = await db.getConnection();

        const [threadRow] = await connection.query("SELECT CONNECTION_ID() AS threadId");
        console.log("✅ MySQL Pool Connection Established with threadId:", threadRow[0].threadId);


        connection.release();
        return db;

    } catch (error) {
        console.error("🚀 ~ ConnectToDb ~ error:", error.message);
        throw error;
    }
};

export { ConnectToDb, db };
