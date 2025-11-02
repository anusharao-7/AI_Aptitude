import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import type { Question, Answer } from "@shared/schema";

export default function QuestionInterface() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  
  const category = searchParams.get('category') || '';
  const topic = searchParams.get('topic') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const count = searchParams.get('count') || '10';

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["questions", category, topic, difficulty, count],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (topic) params.set("topic", topic);
      if (difficulty) params.set("difficulty", difficulty);
      if (count) params.set("count", count);
      
      const res = await fetch(`/api/questions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return await res.json();
    },
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.answerIndex;
  const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  useEffect(() => {
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.time_limit_seconds);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentQuestion]);

  useEffect(() => {
    if (timeRemaining > 0 && !showFeedback && currentQuestion) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, showFeedback, currentQuestion]);

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedAnswer,
      timeSpent,
    };
    
    setAnswers([...answers, answer]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      sessionStorage.setItem('practiceAnswers', JSON.stringify(answers));
      sessionStorage.setItem('practiceQuestions', JSON.stringify(questions));
      setLocation("/practice/results");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">
            No questions found for the selected criteria. Please try different options.
          </p>
          <Button onClick={() => setLocation("/practice")}>Back to Setup</Button>
        </Card>
      </div>
    );
  }

  const timePercent = (timeRemaining / currentQuestion.time_limit_seconds) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => setLocation("/practice")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Practice
            </Button>

            <Card className="p-8 md:p-12">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">{currentQuestion.topic}</span>
                </div>
                <Progress value={progress} className="h-2" data-testid="progress-questions" />
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold mb-8 leading-relaxed" data-testid="text-question">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuestion.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full h-auto p-4 text-left justify-start text-base"
                    onClick={() => !showFeedback && setSelectedAnswer(index)}
                    disabled={showFeedback}
                    data-testid={`button-choice-${index}`}
                  >
                    <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                    {choice}
                  </Button>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto px-8 py-6 text-lg rounded-xl"
                disabled={selectedAnswer === null || showFeedback}
                onClick={handleSubmit}
                data-testid="button-submit"
              >
                Submit Answer
              </Button>
            </Card>
          </div>

          <div className="lg:w-80">
            <Card className="p-6 sticky top-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Time Remaining</h3>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - timePercent / 100)}`}
                      className={`${timePercent < 25 ? "text-destructive" : "text-primary"} transition-all`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-mono font-bold" data-testid="text-timer">
                      {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{currentQuestion.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium">{currentQuestion.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answered:</span>
                  <span className="font-medium">{answers.length} / {questions.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-2xl" data-testid="dialog-feedback">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <span>Incorrect</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-lg leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Correct answer: <span className="font-semibold text-foreground">{currentQuestion.choices[currentQuestion.answerIndex]}</span>
            </div>
            <Button
              size="lg"
              className="w-full py-6 text-lg rounded-xl"
              onClick={handleNext}
              data-testid="button-next"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
