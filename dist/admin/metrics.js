import { config } from "../config.js";
export async function handlerMetrics(_, res, next) {
    try {
        res.set("Content-Type", "text/html; charset=utf-8");
        res.send(`<html><body><h1>Welcome, Chirpy Admin</h1><p>Chirpy has been visited ${config.fileserverHits} times!</p></body></html>`);
        res.end();
        next();
    }
    catch (err) {
        next(err);
    }
}
