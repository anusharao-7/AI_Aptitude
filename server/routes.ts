import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { answerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/topics", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const topics = await storage.getTopics(category);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.get("/api/questions", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        topic: req.query.topic as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        count: req.query.count ? parseInt(req.query.count as string) : undefined,
      };

      const questions = await storage.getQuestions(filters);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.post("/api/submit", async (req, res) => {
    try {
      const answersSchema = z.array(answerSchema);
      const questionIdsSchema = z.array(z.number());

      const answers = answersSchema.parse(req.body.answers);
      const questionIds = questionIdsSchema.parse(req.body.questionIds);

      const result = await storage.calculateResult(answers, questionIds);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to calculate result" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
