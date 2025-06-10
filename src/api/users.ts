import { NextFunction, Request, Response } from "express";
import { createUser } from "./../db/queries/users.js";
import { ValidationError } from "./../errors.js";
export async function handlerCreateUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!("email" in req.body)) {
      throw new ValidationError("No email included");
    } else {
      type parameters = {
        email: string;
      };
      const params: parameters = req.body;
      const user = await createUser({ email: params.email });
      res.status(201).json(user);
      res.end();
    }
  } catch (err) {
    next(err);
  }
}
