import express from "express";
import { Request, Response } from "express";

import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middlewares.js";
import { handlerMetrics } from "./api/metrics.js";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.send();
  res.end();
});
app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
