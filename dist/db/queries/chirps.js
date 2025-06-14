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
export async function getAllChirps(authorId) {
    if (authorId) {
        const result = await db
            .select()
            .from(chirps)
            .where(sql `${chirps.userId} = ${authorId}`);
        return result;
    }
    else {
        const result = await db.select().from(chirps).orderBy(chirps.createdAt);
        return result;
    }
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
