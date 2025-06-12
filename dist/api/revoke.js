import { getBearerToken } from "./../security/auth.js";
import { revokeRefreshToken } from "./../db/queries/refreshTokens.js";
import { AuthorizationError } from "./../errors.js";
export async function handlerRevoke(req, res, next) {
    try {
        const refreshToken = getBearerToken(req);
        if (!refreshToken) {
            throw new AuthorizationError("Invalid token provided to revoke");
        }
        else {
            await revokeRefreshToken(refreshToken);
            res.status(204).send();
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
