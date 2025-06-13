import { Request, Response, NextFunction } from "express";
import { updateIsChirpyRedById } from "./../../db/queries/users.js";
import { NotFoundError } from "./../../errors.js";

export async function handlerWebhooks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    type Parameters = {
      event: string;
      data: {
        userId: string;
      };
    };
    const params: Parameters = req.body;
    if (params.event !== "user.upgraded") {
      res.status(204).send();
      res.end();
    } else {
      const user = await updateIsChirpyRedById(params.data.userId);
      if (!user) {
        throw new NotFoundError("User does not exist");
      }
      res.status(204).send();
      res.end();
    }
  } catch (err) {
    next(err);
  }
}
