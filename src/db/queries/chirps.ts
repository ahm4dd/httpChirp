import { type NewChirp, chirps } from "../schema.js";
import { sql } from "drizzle-orm";
import { db } from "../index.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps() {
  const result = db.select().from(chirps).orderBy(chirps.createdAt);
  return result;
}

export async function getChirpById(id: string) {
  const [result] = await db
    .select()
    .from(chirps)
    .where(sql`${chirps.id} = ${id}`);
  return result;
}

export async function deleteChirpById(id: string) {
  const [result] = await db
    .delete(chirps)
    .where(sql`${chirps.id} = ${id}`)
    .returning();
  return result;
}
