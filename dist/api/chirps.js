import { AuthorizationError, ValidationError, PermissionError, NotFoundError, } from "./../errors.js";
import { createChirp, getAllChirps, getChirpById, deleteChirpById, } from "./../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../security/auth.js";
import { config } from "../config.js";
export async function handlerCreateChirp(req, res, next) {
    try {
        if (!("body" in req.body)) {
            throw new AuthorizationError("No body included in the request");
        }
        const token = getBearerToken(req);
        if (!token) {
            throw new AuthorizationError("No token provided!");
        }
        const params = req.body;
        const userId = validateJWT(token, config.serverApi);
        if (userId === "") {
            throw new AuthorizationError("Invalid token!");
        }
        if (params.body.length > 140) {
            throw new ValidationError("Chirp is too long. Max length is 140");
        }
        else {
            params.body = params.body.trim();
            let profane = ["kerfuffle", "sharbert", "fornax"];
            let filteredWords = [];
            for (const word of params.body.split(" ")) {
                if (profane.includes(word.toLowerCase())) {
                    let asterisks = "*".repeat(4);
                    filteredWords.push(asterisks);
                }
                else
                    filteredWords.push(word);
            }
            const chirp = await createChirp({
                body: filteredWords.join(" "),
                userId: userId,
            });
            res.status(201).json(chirp);
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
export async function handlerGetAllChirps(req, res, next) {
    try {
        const authorId = req.query.authorId;
        const sort = req.query.sort;
        const chirps = await getAllChirps(authorId, sort);
        res.json(chirps);
        res.end();
    }
    catch (err) {
        next(err);
    }
}
export async function handlerGetChirp(req, res, next) {
    try {
        const chirp = await getChirpById(req.params.chirpID);
        if (!chirp) {
            throw new NotFoundError("Chirp does not exist");
        }
        res.json(chirp);
        res.end();
    }
    catch (err) {
        next(err);
    }
}
export async function handlerDeleteChirp(req, res, next) {
    try {
        const token = getBearerToken(req);
        if (!token) {
            throw new AuthorizationError("No token provided!");
        }
        const userId = validateJWT(token, config.serverApi);
        if (userId === "") {
            throw new AuthorizationError("Invalid token!");
        }
        const chirp = await getChirpById(req.params.chirpID);
        if (!chirp) {
            throw new NotFoundError("Chirp does not exist");
        }
        if (chirp.userId !== userId) {
            throw new PermissionError("You do not have permission to delete this chirp");
        }
        const deletedChirp = await deleteChirpById(req.params.chirpID);
        res.status(204).json(deletedChirp);
        res.end();
    }
    catch (err) {
        next(err);
    }
}
