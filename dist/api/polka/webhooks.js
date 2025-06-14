import { updateIsChirpyRedById } from "./../../db/queries/users.js";
import { NotFoundError, AuthorizationError } from "./../../errors.js";
import { getAPIkey } from "./../../security/auth.js";
import { config } from "./../../config.js";
export async function handlerWebhooks(req, res, next) {
    try {
        const apiKey = getAPIkey(req);
        if (apiKey !== config.polkaKey) {
            throw new AuthorizationError("Invalid API key");
        }
        const params = req.body;
        if (params.event !== "user.upgraded") {
            res.status(204).send();
            res.end();
        }
        else {
            const user = await updateIsChirpyRedById(params.data.userId);
            if (!user) {
                throw new NotFoundError("User does not exist");
            }
            res.status(204).send();
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
