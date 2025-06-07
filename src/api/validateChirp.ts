import { Response, Request } from "express";
import express from "express";
import { parse } from "path";
export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  const params: parameters = req.body;
  if (params.body.length > 140) {
    res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
    res.end();
  } else {
    res.status(200).send(JSON.stringify({ valid: true }));
    res.end();
  }
}
