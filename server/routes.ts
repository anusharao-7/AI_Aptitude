import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Question } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Load questions from JSON file
  const questionsPath = join(__dirname, "data", "questions.json");
  const allQuestions: Question[] = JSON.parse(readFileSync(questionsPath, "utf-8"));

  // Shuffle array helper function
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // GET /api/questions/:category
  app.get("/api/questions/:category", (req, res) => {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category parameter is required" });
    }

    // Filter questions by category
    const categoryQuestions = allQuestions.filter((q) => q.category === category);

    if (categoryQuestions.length === 0) {
      return res.status(404).json({ error: "No questions found for this category" });
    }

    // Shuffle and return questions
    const shuffledQuestions = shuffleArray(categoryQuestions);
    res.json(shuffledQuestions);
  });

  const httpServer = createServer(app);

  return httpServer;
}
