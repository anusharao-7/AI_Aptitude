// server/index.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

// ✅ Fix ESM path issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static built React app
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Example API route (optional)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API working fine ✅" });
});

// ✅ Always serve index.html for frontend routes (React Router support)
app.get("*", (_req, res) => {
  const indexFile = path.join(publicPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send("Frontend build not found. Please run npm run build.");
  }
});

// ✅ Port setup for Render (Render assigns PORT automatically)
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Full app (UI + API) running on port ${PORT}`);
});
