import { NextFunction, Request, Response } from "express";
import { config } from "./../config.js";
import { AuthorizationError, ValidationError } from "./../errors.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    if (res.statusCode != 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
) {
  config.fileserverHits++;
  next();
}

export function middlewareError(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof AuthorizationError) {
    statusCode = 401;
    message = err.message;
  }
  if (statusCode >= 500) {
    console.log(err.message);
  }

  res.status(statusCode).json({ error: err.message });
  res.end();
}
