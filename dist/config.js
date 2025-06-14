import process from "process";
process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "src/db/drizzle/",
};
export const config = {
    fileserverHits: 0,
    db: { dbURL: process.env.DB_URL, migrationConfig: migrationConfig },
    platform: process.env.PLATFORM,
    serverApi: process.env.SERVER_API,
    polkaKey: process.env.POLKA_KEY,
};
