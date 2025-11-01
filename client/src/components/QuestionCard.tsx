import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  currentQuestionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  isAnswerLocked: boolean;
}

export default function QuestionCard({
  question,
  currentQuestionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  isAnswerLocked,
}: QuestionCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    hard: "bg-red-100 text-red-700 border-red-300",
  };

  const isCorrect = selectedAnswer === question.answer;

  return (
    <Card className="w-full max-w-3xl" data-testid="question-card">
      <CardHeader className="gap-3 space-y-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground" data-testid="question-number">
            Question {currentQuestionNumber}/{totalQuestions}
          </span>
          <Badge
            className={difficultyColors[question.difficulty]}
            data-testid={`badge-difficulty-${question.difficulty}`}
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h2 className="text-xl font-semibold leading-relaxed" data-testid="question-text">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.answer;
            const showCorrect = isAnswerLocked && isCorrectAnswer;
            const showIncorrect = isAnswerLocked && isSelected && !isCorrect;

            return (
              <Button
                key={index}
                onClick={() => !isAnswerLocked && onAnswerSelect(option)}
                disabled={isAnswerLocked}
                variant={showCorrect ? "default" : showIncorrect ? "destructive" : isSelected ? "secondary" : "outline"}
                className={`w-full justify-start text-left h-auto py-4 px-4 ${
                  showCorrect ? "bg-green-600 hover:bg-green-700 border-green-700" : ""
                } ${
                  showIncorrect ? "bg-red-600 hover:bg-red-700 border-red-700" : ""
                }`}
                data-testid={`button-option-${index}`}
              >
                <span className="flex items-center gap-3 w-full">
                  <span className="flex-1">{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                  {showIncorrect && <XCircle className="w-5 h-5" />}
                </span>
              </Button>
            );
          })}
        </div>

        {isAnswerLocked && question.explanation && (
          <div className="p-4 bg-card border border-card-border rounded-md" data-testid="explanation">
            <p className="text-sm font-medium text-foreground mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      {isAnswerLocked && (
        <CardFooter>
          <div className="w-full text-center">
            {isCorrect ? (
              <p className="text-green-600 font-semibold flex items-center justify-center gap-2" data-testid="result-correct">
                <CheckCircle2 className="w-5 h-5" />
                Correct!
              </p>
            ) : (
              <p className="text-red-600 font-semibold flex items-center justify-center gap-2" data-testid="result-incorrect">
                <XCircle className="w-5 h-5" />
                Incorrect
              </p>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
