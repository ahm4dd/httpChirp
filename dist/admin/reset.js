import { config } from "./../config.js";
export async function handlerReset(_, res, next) {
    try {
        config.fileserverHits = 0;
        res.write("Hits reset to 0");
        res.end();
    }
    catch (err) {
        next(err);
    }
}
