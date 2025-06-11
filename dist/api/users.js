import { createUser } from "./../db/queries/users.js";
import { ValidationError } from "./../errors.js";
import { hashPassword } from "../security/auth.js";
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
