import { Response, Request, NextFunction } from "express";
export async function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    type parameters = {
      body: string;
    };
    const params: parameters = req.body;
    if (params.body.length > 140) {
      throw Error();
    } else {
      params.body = params.body.trim();
      let profane: string[] = ["kerfuffle", "sharbert", "fornax"];
      let filteredWords: string[] = [];
      for (const word of params.body.split(" ")) {
        if (profane.includes(word.toLowerCase())) {
          let asterisks = "*".repeat(4);
          filteredWords.push(asterisks);
        } else filteredWords.push(word);
      }
      res
        .status(200)
        .send(JSON.stringify({ cleanedBody: filteredWords.join(" ") }));
      res.end();
    }
  } catch (err) {
    next(err);
  }
}
