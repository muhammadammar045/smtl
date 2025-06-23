import app from "./app.js";
import { ConnectToDb } from "./config/database.js";

const startServer = async () => {
    try {
        await ConnectToDb().then(() => {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => {
                console.log(`✅ App is listening on http://localhost:${PORT}`);
            });
        });
    } catch (error) {
        console.error("❌ Failed to connect to the database", error);
        process.exit(1);
    }
};

startServer();
