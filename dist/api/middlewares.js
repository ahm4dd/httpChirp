import { config } from "./../config.js";
import { AuthorizationError, ValidationError } from "./../errors.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(_, __, next) {
    config.fileserverHits++;
    next();
}
export function middlewareError(err, _, res, __) {
    if (err instanceof ValidationError) {
        console.error("A ValidationError occurred.");
        res.status(400).json({ error: err.message });
        res.end();
    }
    else if (err instanceof AuthorizationError) {
        console.log("An AuthorizationError occurred.");
        res.status(401).json({ error: err.message });
        res.end();
    }
    else {
        console.error("Error occurred.");
        res.status(500).json({ error: "Something went wrong on our end" });
        res.end();
    }
}
