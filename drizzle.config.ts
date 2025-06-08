import { defineConfig } from "drizzle-kit";
process.loadEnvFile("./credientials.env");
export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
