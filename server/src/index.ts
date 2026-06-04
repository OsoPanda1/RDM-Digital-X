import "dotenv/config";
import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import apiRouter from "./routes/index.js";
import { config } from "./config.js";
import { errorHandler, notFoundHandler } from "./middleware/http.js";
import { constitutionalGuard } from "./middleware/constitutionalGuard.js";
import { createHardenedRateLimiter } from "./middleware/rateLimit.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  req.id = randomUUID();
  res.setHeader("X-Request-ID", req.id);
  next();
});

app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=(), payment=(self)");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  );
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Request-ID"],
  }),
);

app.use(express.json({ limit: "1mb", strict: true }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: "rdmx-api", requestId: res.getHeader("X-Request-ID") });
});

app.use(
  "/api",
  createHardenedRateLimiter({
    maxRequests: config.rateLimitMaxRequests,
    windowMs: config.rateLimitWindowMs,
    keyPrefix: "global-api",
  }),
  constitutionalGuard,
  apiRouter,
);
app.use(notFoundHandler);
app.use(errorHandler);

export function startServer(port = config.port) {
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`RDM backend running on http://localhost:${port}`);
  });

  const shutdown = (signal: NodeJS.Signals) => {
    // eslint-disable-next-line no-console
    console.log(`${signal} recibido: cerrando servidor RDM de forma ordenada`);
    server.close((error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error durante graceful shutdown", error);
        process.exit(1);
      }
      process.exit(0);
    });
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

  return server;
}

const isEntrypoint = process.argv[1] && process.argv[1].endsWith("index.js");
if (isEntrypoint) {
  startServer();
}
