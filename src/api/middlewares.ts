import { NextFunction, Request, Response } from "express";
import { config } from "./../config.js";

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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error occurred.");
  res.status(500).json({ error: "Something went wrong on our end" });
  res.end();
}
