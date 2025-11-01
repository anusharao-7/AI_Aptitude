import { useState } from "react";
import QuestionCard from "../QuestionCard";
import type { Question } from "@shared/schema";

export default function QuestionCardExample() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const mockQuestion: Question = {
    id: 1,
    category: "quant",
    difficulty: "medium",
    question: "What is 25% of 160?",
    options: ["30", "35", "40", "45"],
    answer: "40",
    explanation: "25% = 1/4, so 160/4 = 40",
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsLocked(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <QuestionCard
        question={mockQuestion}
        currentQuestionNumber={3}
        totalQuestions={10}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        isAnswerLocked={isLocked}
      />
    </div>
  );
}
