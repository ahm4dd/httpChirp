import { Response, Request } from "express";
export async function handlerValidateChirp(req: Request, res: Response) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const parsedBody = JSON.parse(body);
    if (parsedBody.body?.length > 140) {
      res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
      res.end();
    } else {
      res.status(200).send(JSON.stringify({ valid: true }));
      res.end();
    }
  });
}
