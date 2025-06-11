import { NextFunction, Request, Response } from "express";
import { createUser } from "./../db/queries/users.js";
import { ValidationError } from "./../errors.js";
import { hashPassword } from "../security/auth.js";
import { NewUser } from "./../db/schema.js";
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
