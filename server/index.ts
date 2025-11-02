// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Simple request logger for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // capture JSON responses for compact logs
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore: preserve original call signature
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 160) {
        logLine = logLine.slice(0, 159) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // register API routes (expects registerRoutes to return an http.Server or similar)
  const server = await registerRoutes(app);

  // global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Only setup dev middleware if running in development (local)
  if (app.get("env") === "development") {
    // setupVite will mount Vite dev middleware and SSR transform
    await setupVite(app, server);
  } else {
    // production: serve the static frontend build from dist/public
    // note: at runtime compiled server will be in dist/, so __dirname will be dist/
    // dist/public must exist (created by vite build)
    const builtPublic = path.resolve(__dirname, "public");
    // serveStatic exported util (if you have one) or fallback to express.static
    try {
      // prefer helper if available
      serveStatic(app);
    } catch (e) {
      // fallback: ensure the folder exists and serve it
      app.use(express.static(builtPublic));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve(builtPublic, "index.html"));
      });
    }
  }

  // server.listen uses process.env.PORT provided by Render
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
