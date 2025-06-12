import { NextFunction, Request, Response } from "express";
import { createUser, getUserById, updateUser } from "./../db/queries/users.js";
import { ValidationError, AuthorizationError } from "./../errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../security/auth.js";
import { NewUser } from "./../db/schema.js";
import { config } from "./../config.js";

export async function handlerCreateUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!("email" in req.body) || !("password" in req.body)) {
      throw new ValidationError("No email/password included");
    } else {
      type parameters = {
        email: string;
        password: string;
      };
      const params: parameters = req.body;
      const user = await createUser({
        email: params.email,
        hashedPassword: hashPassword(params.password)!,
      });
      const noPasswordUser: Omit<NewUser, "hashedPassword"> = user;
      res.status(201).json(noPasswordUser);
      res.end();
    }
  } catch (err) {
    next(err);
  }
}

export async function handlerUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      throw new AuthorizationError("No token provided!");
    }
    type Parameters = {
      email: string;
      password: string;
    };
    const params: Parameters = req.body;
    const userId = validateJWT(token, config.serverApi);
    if (userId === "") {
      throw new AuthorizationError("Invalid token!");
    }
    const email = params.email;
    const hashedPassword = hashPassword(params.password);
    const newUser: Omit<NewUser, "hashedPassword"> = await updateUser({
      id: userId,
      hashedPassword: hashedPassword,
      email: email,
    });
    res.json(newUser);
    res.end();
  } catch (err) {
    next(err);
  }
}
