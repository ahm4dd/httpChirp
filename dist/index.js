import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, } from "./api/middlewares.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
const app = express();
const PORT = 8080;
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerMetrics);
app.get("/api/healthz", handlerReadiness);
//app.get("/admin/metrics");
app.get("/admin/reset", handlerReset);
app.use(middlewareLogResponses);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
