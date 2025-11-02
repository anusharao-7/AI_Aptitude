// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react() // ✅ React plugin for JSX + Fast Refresh
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  // ✅ The client root folder (where index.html and src/ live)
  root: path.resolve(__dirname, "client"),

  build: {
    // ✅ Output built files where Express can find them
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,

    // ✅ Ensure absolute paths work in deployment
    assetsDir: "assets",
  },

  // ✅ Local dev server setup
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    host: "0.0.0.0",
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      // ✅ Forward API requests to backend when running locally
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ Ensure correct base path on Render (so assets load correctly)
  base: "./",
});
