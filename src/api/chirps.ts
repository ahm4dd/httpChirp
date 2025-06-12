import { NextFunction, Request, Response } from "express";
import {
  AuthorizationError,
  ValidationError,
  PermissionError,
  NotFoundError,
} from "./../errors.js";
import {
  createChirp,
  getAllChirps,
  getChirpById,
  deleteChirpById,
} from "./../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../security/auth.js";
import { config } from "../config.js";

export async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!("body" in req.body)) {
      throw new AuthorizationError("No body included in the request");
    }
    const token = getBearerToken(req);
    if (!token) {
      throw new AuthorizationError("No token provided!");
    }
    type parameters = {
      body: string;
    };
    const params: parameters = req.body;
    const userId = validateJWT(token, config.serverApi);
    if (userId === "") {
      throw new AuthorizationError("Invalid token!");
    }
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
        userId: userId,
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
    const chirp = await getChirpById(req.params.chirpID);
    if (!chirp) {
      throw new NotFoundError("Chirp does not exist");
    }
    res.json(chirp);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function handlerDeleteChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
      throw new PermissionError(
        "You do not have permission to delete this chirp",
      );
    }
    const deletedChirp = await deleteChirpById(req.params.chirpID);
    res.status(204).json(deletedChirp);
    res.end();
  } catch (err) {
    next(err);
  }
}
