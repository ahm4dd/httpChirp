import { NextFunction, Request, Response } from "express";
import { config } from "./../config.js";
import { ValidationError } from "./../errors.js";

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
  if (err instanceof ValidationError) {
    console.error("A ValidationError occurred.");
    res.status(400).json({ error: err.message });
    res.end();
  } else {
    console.error("Error occurred.");
    res.status(500).json({ error: "Something went wrong on our end" });
    res.end();
  }
}
