import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Home, RotateCcw } from "lucide-react";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToHome: () => void;
}

export default function ResultScreen({
  score,
  totalQuestions,
  onRestart,
  onBackToHome,
}: ResultScreenProps) {
  const accuracy = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return "Excellent work!";
    if (accuracy >= 60) return "Good job!";
    if (accuracy >= 40) return "Keep practicing!";
    return "Don't give up!";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" data-testid="result-card">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold" data-testid="text-performance-message">
            {getPerformanceMessage()}
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-6 bg-card border border-card-border rounded-md">
              <div className="text-5xl font-bold text-primary mb-2" data-testid="text-score">
                {score}/{totalQuestions}
              </div>
              <p className="text-sm text-muted-foreground">Questions Correct</p>
            </div>

            <div className="p-4 bg-card border border-card-border rounded-md">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <span className="text-2xl font-semibold" data-testid="text-accuracy">
                  {accuracy}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={onRestart}
            className="w-full"
            size="lg"
            data-testid="button-restart"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Quiz
          </Button>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full"
            size="lg"
            data-testid="button-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
