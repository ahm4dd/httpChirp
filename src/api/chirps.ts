import { NextFunction, Request, Response } from "express";
import { ValidationError } from "./../errors.js";
import {
  createChirp,
  getAllChirps,
  getChirpById,
} from "./../db/queries/chirps.js";

export async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!("body" in req.body) || !("userId" in req.body)) {
      throw new ValidationError("No body or userId included in the request");
    }
    type parameters = {
      body: string;
      userId: string;
    };
    const params: parameters = req.body;
    if (params.body.length > 140) {
      throw new ValidationError("Chirp is too long. Max length is 140");
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
      const chirp = await createChirp({
        body: filteredWords.join(" "),
        userId: params.userId,
      });
      res.status(201).json(chirp);
      res.end();
    }
  } catch (err) {
    next(err);
  }
}

export async function handlerGetAllChirps(
  _: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chirps = await getAllChirps();
    res.json(chirps);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function handlerGetChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    try {
      const chirp = await getChirpById(req.params.chirpID);

      res.json(chirp);
      res.end();
    } catch (err) {
      throw new ValidationError("Chirp does not exist");
    }
  } catch (err) {
    next(err);
  }
}
