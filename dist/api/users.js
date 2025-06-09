import { createUser } from "./../db/queries/users.js";
import { ValidationError } from "./../errors.js";
export async function handlerCreateUsers(req, res, next) {
    try {
        if (!("email" in req.body)) {
            throw new ValidationError("No email included");
        }
        else {
            const params = req.body;
            const user = await createUser({ email: params.email });
            res.status(201).json({
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.createdAt,
                email: user.email,
            });
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
