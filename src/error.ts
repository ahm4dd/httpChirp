import { Response, Request, NextFunction } from "express";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error occurred.");
  res.status(500).json({ error: "Something went wrong on our end" });
  res.end();
}
