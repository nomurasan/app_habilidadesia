import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./routes/api";
import {
  correlationIdMiddleware,
  securityHeadersMiddleware,
  corsMiddleware,
  sanitizationMiddleware,
} from "./middleware/security";

export async function createApplication() {
  const app = express();

  // Basic native express settings
  app.use(express.json());

  // Mount global correlation and structured logging
  app.use(correlationIdMiddleware);

  // Mount security headers and CORS
  app.use(securityHeadersMiddleware);
  app.use(corsMiddleware);

  // Input Sanitization against XSS
  app.use(sanitizationMiddleware);

  // REST API routes
  app.use("/api", apiRouter);

  // Vite middleware setup (Asset & SPA serving)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}
