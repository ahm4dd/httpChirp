export async function handlerValidateChirp(req, res) {
    const params = req.body;
    if (params.body.length > 140) {
        res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
        res.end();
    }
    else {
        res.status(200).send(JSON.stringify({ valid: true }));
        res.end();
    }
}
