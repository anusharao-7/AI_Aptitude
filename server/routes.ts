import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the question type
interface Question {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Path to your questions JSON file
  const questionsPath = join(__dirname, "data", "questions.json");

  // Read and parse the JSON file
  let allQuestions: Question[] = [];
  try {
    const fileData = readFileSync(questionsPath, "utf-8");
    allQuestions = JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading questions.json:", error);
  }

  // Shuffle array helper function
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ✅ API route: Get questions by category
  app.get("/api/questions/:category", (req, res) => {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category parameter is required" });
    }

    // Filter questions by category
    const categoryQuestions = allQuestions.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryQuestions.length === 0) {
      return res.status(404).json({ error: "No questions found for this category" });
    }

    // Shuffle before returning
    const shuffledQuestions = shuffleArray(categoryQuestions);
    res.json(shuffledQuestions);
  });

  // ✅ Simple route to test if backend works
  app.get("/", (_, res) => {
    res.send("✅ API is running successfully!");
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
