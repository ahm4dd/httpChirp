import { checkPasswordHash, makeJWT, makeRefreshToken, } from "../security/auth.js";
import { getUserByEmail } from "./../db/queries/users.js";
import { AuthorizationError } from "./../errors.js";
import { config } from "./../config.js";
import { createRefreshToken } from "./../db/queries/refreshTokens.js";
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
            const tokenExpiresInSeconds = params.expiresInSeconds ?? 3600;
            const refreshToken = await createRefreshToken({
                token: makeRefreshToken(),
                userId: user.id,
                expiresAt: new Date(Date.now() + 5184000),
                revokedAt: null,
            });
            res.status(200).json({
                ...noPasswordUser,
                token: makeJWT(user.id, tokenExpiresInSeconds, config.serverApi),
                refreshToken: refreshToken.token,
            });
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
