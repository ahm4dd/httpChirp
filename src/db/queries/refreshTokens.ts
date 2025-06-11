import {
  NewRefreshToken,
  refreshTokens,
  RefreshToken,
  users,
} from "../schema.js";
import { db } from "./../index.js";
import { sql } from "drizzle-orm";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshTokenByToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(sql`${refreshTokens.token} = ${token}`);
  return result;
}

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(sql`${refreshTokens.token} = ${token}`);
  return result.userId;
}

export async function revokeRefreshToken(token: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(Date.now()) })
    .returning();
  return result;
}
