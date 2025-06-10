import { checkPasswordHash } from "./../db/auth.js";
import { getUserByEmail } from "./../db/queries/users.js";
import { AuthorizationError } from "./../errors.js";
export async function handlerLogin(req, res, next) {
    try {
        const params = req.body;
        try {
            const user = await getUserByEmail(params.email);
            if (!user)
                throw new AuthorizationError("User doesn't exist");
            if (!checkPasswordHash(params.password, user.hashedPassword))
                throw new AuthorizationError("Wrong password!");
            const noPasswordUser = user;
            res.status(200).json(noPasswordUser);
            res.end();
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
}
