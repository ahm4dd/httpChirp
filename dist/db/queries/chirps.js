import { chirps } from "../schema.js";
import { sql } from "drizzle-orm";
import { db } from "../index.js";
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getAllChirps(authorId, sort = "asc") {
    const query = db.select().from(chirps);
    const filteredQuery = authorId
        ? query.where(sql `${chirps.userId} = ${authorId}`)
        : query;
    const result = await filteredQuery.orderBy(sql `${chirps.createdAt} ${sql.raw(sort)}`);
    return result;
}
export async function getChirpById(id) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(sql `${chirps.id} = ${id}`);
    return result;
}
export async function deleteChirpById(id) {
    const [result] = await db
        .delete(chirps)
        .where(sql `${chirps.id} = ${id}`)
        .returning();
    return result;
}
