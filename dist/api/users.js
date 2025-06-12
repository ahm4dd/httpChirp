import { createUser, updateUser } from "./../db/queries/users.js";
import { ValidationError, AuthorizationError } from "./../errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../security/auth.js";
import { config } from "./../config.js";
export async function handlerCreateUsers(req, res, next) {
    try {
        if (!("email" in req.body) || !("password" in req.body)) {
            throw new ValidationError("No email/password included");
        }
        else {
            const params = req.body;
            const user = await createUser({
                email: params.email,
                hashedPassword: hashPassword(params.password),
            });
            const noPasswordUser = user;
            res.status(201).json(noPasswordUser);
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
export async function handlerUpdateUser(req, res, next) {
    try {
        const token = getBearerToken(req);
        if (!token) {
            throw new AuthorizationError("No token provided!");
        }
        const params = req.body;
        const userId = validateJWT(token, config.serverApi);
        if (userId === "") {
            throw new AuthorizationError("Invalid token!");
        }
        const email = params.email;
        const hashedPassword = hashPassword(params.password);
        const newUser = await updateUser({
            id: userId,
            hashedPassword: hashedPassword,
            email: email,
        });
        res.json(newUser);
        res.end();
    }
    catch (err) {
        next(err);
    }
}
