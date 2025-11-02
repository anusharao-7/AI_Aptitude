// server/index.ts
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API (you can add more routes in server/routes.ts)
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "✅ API working fine" });
});

// ✅ Serve React build from dist/public
const publicPath = path.join(__dirname, "public");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));

  // Handle React Router routes (send index.html)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
} else {
  app.get("*", (_req, res) => {
    res.send("⚙️ Build not found. Please run `npm run build` first.");
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Server
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Frontend running at http://localhost:${PORT}`);
});
