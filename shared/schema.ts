import { z } from "zod";

export const questionSchema = z.object({
  id: z.number(),
  category: z.enum(["Quantitative", "Logical", "Verbal", "Technical"]),
  topic: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  question: z.string(),
  choices: z.array(z.string()),
  answerIndex: z.number(),
  explanation: z.string(),
  time_limit_seconds: z.number(),
});

export type Question = z.infer<typeof questionSchema>;

export const answerSchema = z.object({
  questionId: z.number(),
  selectedIndex: z.number(),
  timeSpent: z.number(),
});

export type Answer = z.infer<typeof answerSchema>;

export const resultSchema = z.object({
  score: z.number(),
  totalQuestions: z.number(),
  accuracy: z.number(),
  totalTime: z.number(),
  weakAreas: z.array(z.object({
    topic: z.string(),
    attempted: z.number(),
    correct: z.number(),
    accuracy: z.number(),
  })),
});

export type Result = z.infer<typeof resultSchema>;
