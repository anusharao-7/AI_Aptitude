import { z } from "zod";

export const questionSchema = z.object({
  id: z.number(),
  category: z.enum(["quant", "logical", "verbal", "technical"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  explanation: z.string(),
});

export type Question = z.infer<typeof questionSchema>;

export const categoryDisplayNames: Record<string, string> = {
  quant: "Quantitative Aptitude",
  logical: "Logical Reasoning",
  verbal: "Verbal Ability",
  technical: "Technical",
};
