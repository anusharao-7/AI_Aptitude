// server/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

// Handle ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve the built frontend
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Example API route (optional)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API working fine ✅" });
});

// ✅ Catch-all to send index.html for React Router
app.get("*", (_, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Build not found");
  }
});

// ✅ Dynamic Render port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`[express] 🚀 Server + UI running on port ${PORT}`);
});
