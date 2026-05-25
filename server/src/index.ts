import "dotenv/config";
import cors from "cors";
import express from "express";
import apiRouter from "./routes/index.js";
import { config } from "./config.js";
import { errorHandler, notFoundHandler } from "./middleware/http.js";
import { constitutionalGuard } from "./middleware/constitutionalGuard.js";

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
  }),
);

app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: "rdmx-api" });
});

app.use("/api", constitutionalGuard, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export function startServer(port = config.port) {
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`RDM backend running on http://localhost:${port}`);
  });

  return server;
}

const isEntrypoint = process.argv[1] && process.argv[1].endsWith("index.js");
if (isEntrypoint) {
  startServer();
}
