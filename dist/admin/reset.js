import { config } from "./../config.js";
import { deleteUsers } from "./../db/queries/users.js";
export async function handlerReset(_, res, next) {
    try {
        if (config.platform !== "dev") {
            res.status(403).send("Forbidden");
            res.end();
        }
        else {
            await deleteUsers();
            config.fileserverHits = 0;
            res.write("Hits reset to 0");
            res.end();
        }
    }
    catch (err) {
        next(err);
    }
}
