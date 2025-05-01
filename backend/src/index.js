import { config } from "dotenv";
import app from "./app.js";
import { ConnectToDb } from "./db/conn.js";

config();

const startServer = async () => {
    try {
        await ConnectToDb();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ App is listening on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(`❌ MySQL Connection Failed ::`, error);
        process.exit(1);
    }
};

startServer();
