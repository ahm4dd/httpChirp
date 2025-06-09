import { MigrationConfig } from "drizzle-orm/migrator";

import process from "process";
process.loadEnvFile();
type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
};

export type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "src/db/drizzle/",
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: { dbURL: process.env.DB_URL!, migrationConfig: migrationConfig },
};
