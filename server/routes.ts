import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import type { Question } from "@shared/schema";

// ✅ Ensure consistent directory reference
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // ✅ Use process.cwd() so path works in both dev & production
    const questionsPath = join(process.cwd(), "src", "data", "questions.json");

    console.log("📁 Loading questions from:", questionsPath);
    const fileData = readFileSync(questionsPath, "utf-8");
    const allQuestions: Question[] = JSON.parse(fileData);

    // ✅ Helper to shuffle questions
    function shuffleArray<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    // ✅ API route to get questions by category
    app.get("/api/questions/:category", (req, res) => {
      const { category } = req.params;

      if (!category) {
        return res.status(400).json({ error: "Category parameter is required" });
      }

      const categoryQuestions = allQuestions.filter(
        (q) => q.category.toLowerCase() === category.toLowerCase()
      );

      if (categoryQuestions.length === 0) {
        return res.status(404).json({ error: "No questions found for this category" });
      }

      const shuffledQuestions = shuffleArray(categoryQuestions);
      res.json(shuffledQuestions);
    });

    // ✅ Health check route (for Render debugging)
    app.get("/api/health", (_req, res) => {
      res.json({ status: "ok", message: "Backend is running on Render 🚀" });
    });

    const httpServer = createServer(app);
    return httpServer;
  } catch (err) {
    console.error("❌ Failed to register routes:", err);
    throw err;
  }
}
