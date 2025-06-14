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

export async function getAllChirps(
  authorId?: string,
  sort: "asc" | "desc" = "asc",
) {
  const query = db.select().from(chirps);
  const filteredQuery = authorId
    ? query.where(sql`${chirps.userId} = ${authorId}`)
    : query;
  const result = await filteredQuery.orderBy(
    sql`${chirps.createdAt} ${sql.raw(sort)}`,
  );
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
