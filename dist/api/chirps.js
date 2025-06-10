import { ValidationError } from "./../errors.js";
import { createChirp, getAllChirps } from "./../db/queries/chirps.js";
export async function handlerCreateChirp(req, res, next) {
    try {
        if (!("body" in req.body) || !("userId" in req.body)) {
            throw new ValidationError("No body or userId included in the request");
        }
        const params = req.body;
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
                userId: params.userId,
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
        const chirps = await getAllChirps();
        res.json(chirps);
        res.end();
    }
    catch (err) {
        next(err);
    }
}
