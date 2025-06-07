export async function handlerValidateChirp(req, res) {
    const params = req.body;
    if (params.body.length > 140) {
        res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
        res.end();
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
        res
            .status(200)
            .send(JSON.stringify({ cleanedBody: filteredWords.join(" ") }));
        res.end();
    }
}
