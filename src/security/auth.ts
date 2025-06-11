import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { ValidationError } from "../errors.js";

const SALT_ROUNDS = 10;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

export function checkPasswordHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    let decoded = jwt.verify(tokenString, secret);
    return decoded.sub as string;
  } catch (err) {
    throw new ValidationError("Invalid token!");
  }
}
