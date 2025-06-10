import { db } from "../index.js";
import { users } from "../schema.js";
import { sql } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteUsers() {
    await db.delete(users);
}
export async function getUserByEmail(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(sql `${users.email} = ${email}`);
    return result;
}
