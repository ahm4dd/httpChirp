import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareError,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middlewares.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerValidateChirp } from "./api/validateChirp.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerMetrics);
app.get("/api/healthz", handlerReadiness);
//app.get("/admin/metrics");
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);
app.use(middlewareLogResponses);

app.use(middlewareError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
