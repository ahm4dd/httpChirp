import { refreshTokens, } from "../schema.js";
import { db } from "./../index.js";
import { sql } from "drizzle-orm";
export async function createRefreshToken(refreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getRefreshTokenByToken(token) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(sql `${refreshTokens.token} = ${token}`);
    return result;
}
export async function getUserFromRefreshToken(token) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(sql `${refreshTokens.token} = ${token}`);
    return result.userId;
}
export async function revokeRefreshToken(token) {
    const [result] = await db
        .update(refreshTokens)
        .set({ revokedAt: new Date(Date.now()) })
        .returning();
    return result;
}
