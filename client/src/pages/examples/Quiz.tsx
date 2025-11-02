import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ResultScreen from "@/components/ResultScreen";
import type { Question } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface QuizProps {
  category: string;
  onBackToHome: () => void;
}

export default function Quiz({ category, onBackToHome }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // ✅ Connect frontend to your backend deployed on Render
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const { data: questions = [], isLoading, isError } = useQuery<Question[]>({
    queryKey: ["/api/questions", category],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/questions/${category}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerLocked) return;
    setSelectedAnswer(answer);
    setIsAnswerLocked(true);

    if (answer === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleTimeUp = () => {
    if (!isAnswerLocked) {
      setIsAnswerLocked(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setScore(0);
    setShowResults(false);
  };

  // ✅ Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-red-500">
          Failed to load questions. Please try again later.
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          No questions available for this category.
        </p>
      </div>
    );
  }

  if (showResults) {
    return (
      <ResultScreen
        score={score}
        totalQuestions={totalQuestions}
        onRestart={handleRestart}
        onBackToHome={onBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-end">
          <Timer
            initialSeconds={60}
            onTimeUp={handleTimeUp}
            isActive={!isAnswerLocked}
          />
        </div>

        <QuestionCard
          question={currentQuestion}
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          isAnswerLocked={isAnswerLocked}
        />

        {isAnswerLocked && (
          <div className="flex justify-center">
            <Button
              onClick={handleNextQuestion}
              size="lg"
              className="min-w-[200px]"
              data-testid="button-next"
            >
              {currentQuestionIndex < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
