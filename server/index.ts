// server/index.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

// ✅ Fix ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve built React files from dist/public
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Example API route (still works)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API working fine ✅" });
});

// ✅ React Router fallback — always send index.html
app.get("*", (_, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend build not found. Try rebuilding the project.");
  }
});

// ✅ Port for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] 🚀 Full app (UI + API) running on port ${PORT}`);
});
