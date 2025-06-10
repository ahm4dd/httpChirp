import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}
export function checkPasswordHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}
