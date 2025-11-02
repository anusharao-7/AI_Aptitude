import { type Question, type Answer, type Result } from "@shared/schema";
import questions from "./data/questions.json";

export interface IStorage {
  getQuestions(filters: {
    category?: string;
    topic?: string;
    difficulty?: string;
    count?: number;
  }): Promise<Question[]>;
  getCategories(): Promise<string[]>;
  getTopics(category?: string): Promise<string[]>;
  calculateResult(answers: Answer[], questionIds: number[]): Promise<Result>;
}

export class MemStorage implements IStorage {
  private questions: Question[];

  constructor() {
    this.questions = questions as Question[];
  }

  async getQuestions(filters: {
    category?: string;
    topic?: string;
    difficulty?: string;
    count?: number;
  }): Promise<Question[]> {
    let filtered = this.questions;

    if (filters.category) {
      filtered = filtered.filter((q) => q.category === filters.category);
    }

    if (filters.topic) {
      filtered = filtered.filter((q) => q.topic === filters.topic);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    
    const count = filters.count || 10;
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async getCategories(): Promise<string[]> {
    const categoriesSet = new Set(this.questions.map((q) => q.category));
    const categories = Array.from(categoriesSet);
    return categories.sort();
  }

  async getTopics(category?: string): Promise<string[]> {
    let filtered = this.questions;
    
    if (category) {
      filtered = filtered.filter((q) => q.category === category);
    }

    const topicsSet = new Set(filtered.map((q) => q.topic));
    const topics = Array.from(topicsSet);
    return topics.sort();
  }

  async calculateResult(answers: Answer[], questionIds: number[]): Promise<Result> {
    const questionMap = new Map(
      this.questions.map((q) => [q.id, q])
    );

    let correct = 0;
    let totalTime = 0;
    const topicStats = new Map<string, { attempted: number; correct: number }>();

    answers.forEach((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) return;

      const isCorrect = answer.selectedIndex === question.answerIndex;
      if (isCorrect) correct++;

      totalTime += answer.timeSpent;

      const stats = topicStats.get(question.topic) || { attempted: 0, correct: 0 };
      stats.attempted++;
      if (isCorrect) stats.correct++;
      topicStats.set(question.topic, stats);
    });

    const weakAreas = Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        topic,
        attempted: stats.attempted,
        correct: stats.correct,
        accuracy: (stats.correct / stats.attempted) * 100,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return {
      score: correct,
      totalQuestions: answers.length,
      accuracy: (correct / answers.length) * 100,
      totalTime,
      weakAreas,
    };
  }
}

export const storage = new MemStorage();
