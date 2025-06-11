import { param } from "drizzle-orm";
import { Response, Request, NextFunction } from "express";
import { checkPasswordHash, makeJWT } from "../security/auth.js";
import { getUserByEmail } from "./../db/queries/users.js";
import { NewUser } from "./../db/schema.js";
import { AuthorizationError } from "./../errors.js";
import { config } from "./../config.js";

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    type Parameters = {
      email: string;
      password: string;
      expiresInSeconds?: number;
    };
    const params: Parameters = req.body;
    try {
      const user = await getUserByEmail(params.email);
      if (!user) throw new AuthorizationError("User doesn't exist");
      if (!checkPasswordHash(params.password, user.hashedPassword))
        throw new AuthorizationError("Wrong password!");
      const noPasswordUser: Omit<NewUser, "hashedPassword"> = user;
      const expiresInSeconds = params.expiresInSeconds ?? 3600;
      res.status(200).json({
        ...noPasswordUser,
        token: makeJWT(user.id, expiresInSeconds, config.serverApi),
      });
      res.end();
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
}
