import process from "process";
process.loadEnvFile();
export const config = {
    fileserverHits: 0,
    dbURL: process.env.DB_URL,
};
