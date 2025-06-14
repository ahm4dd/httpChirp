import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthorizationError } from "../errors.js";
import crypto from "node:crypto";
const SALT_ROUNDS = 10;
export function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}
export function checkPasswordHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}
export function makeJWT(userID, expiresIn, secret) {
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    try {
        let decoded = jwt.verify(tokenString, secret);
        return decoded.sub;
    }
    catch (err) {
        throw new AuthorizationError("Invalid token!");
    }
}
export function getBearerToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        throw new AuthorizationError("No token provided");
    const token = authHeader.replace("Bearer ", "");
    if (!token)
        throw new AuthorizationError("No token provided");
    return token;
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
export function getAPIkey(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        throw new AuthorizationError("No API key provided");
    const apiKey = authHeader.replace("ApiKey ", "");
    if (!apiKey)
        throw new AuthorizationError("No API key provided");
    return apiKey;
}
