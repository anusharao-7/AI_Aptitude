import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trophy, Clock, Target, TrendingDown, CheckCircle2, XCircle, Home, RefreshCw } from "lucide-react";
import type { Question, Answer, Result } from "@shared/schema";

export default function ResultsSummary() {
  const [, setLocation] = useLocation();
  const [filterType, setFilterType] = useState<"all" | "incorrect">("all");
  const [result, setResult] = useState<Result | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const submitMutation = useMutation({
    mutationFn: async (data: { answers: Answer[]; questionIds: number[] }) => {
      const res = await apiRequest("POST", "/api/submit", data);
      return await res.json() as Result;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem('practiceAnswers');
    const storedQuestions = sessionStorage.getItem('practiceQuestions');
    
    if (storedAnswers && storedQuestions) {
      const parsedAnswers = JSON.parse(storedAnswers) as Answer[];
      const parsedQuestions = JSON.parse(storedQuestions) as Question[];
      
      setAnswers(parsedAnswers);
      setQuestions(parsedQuestions);

      submitMutation.mutate({
        answers: parsedAnswers,
        questionIds: parsedQuestions.map(q => q.id),
      });

      sessionStorage.removeItem('practiceAnswers');
      sessionStorage.removeItem('practiceQuestions');
    } else {
      setLocation("/practice");
    }
  }, []);

  if (!result || submitMutation.isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating results...</p>
        </div>
      </div>
    );
  }

  const questionsWithAnswers = questions.map((question, index) => {
    const userAnswer = answers[index];
    return {
      ...question,
      userAnswer: question.choices[userAnswer.selectedIndex],
      correctAnswer: question.choices[question.answerIndex],
      isCorrect: userAnswer.selectedIndex === question.answerIndex,
    };
  });

  const filteredQuestions = filterType === "all" 
    ? questionsWithAnswers 
    : questionsWithAnswers.filter(q => !q.isCorrect);

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12" data-testid="text-results-heading">
          Practice Session Complete!
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 text-chart-4 mx-auto mb-4" />
            <div className="text-5xl font-bold mb-2" data-testid="text-score">
              {result.score}/{result.totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Score</div>
          </Card>

          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-chart-1 mx-auto mb-4" />
            <div className="text-5xl font-bold mb-2" data-testid="text-accuracy">
              {result.accuracy.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </Card>

          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 text-chart-2 mx-auto mb-4" />
            <div className="text-5xl font-bold mb-2" data-testid="text-time">
              {Math.floor(result.totalTime / 60)}:{String(result.totalTime % 60).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </Card>
        </div>

        {result.weakAreas.length > 0 && (
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold">Areas to Improve</h2>
            </div>
            <div className="space-y-4">
              {result.weakAreas.map((area, index) => (
                <div key={index} className="space-y-2" data-testid={`weak-area-${index}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{area.topic}</span>
                    <span className="text-sm text-muted-foreground">
                      {area.correct}/{area.attempted} correct ({area.accuracy.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={area.accuracy} className="h-3" />
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Question Review</h2>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                data-testid="button-filter-all"
              >
                All
              </Button>
              <Button
                variant={filterType === "incorrect" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("incorrect")}
                data-testid="button-filter-incorrect"
              >
                Incorrect Only
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredQuestions.map((question, index) => (
              <AccordionItem key={question.id} value={`item-${question.id}`} data-testid={`accordion-question-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    {question.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    )}
                    <span className="text-left flex-1">Question {question.id}: {question.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4 pl-8">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Your Answer: </span>
                      <span className={question.isCorrect ? "text-green-500" : "text-destructive"}>
                        {question.userAnswer}
                      </span>
                    </div>
                    {!question.isCorrect && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Correct Answer: </span>
                        <span className="text-green-500">{question.correctAnswer}</span>
                      </div>
                    )}
                    <div className="bg-muted p-4 rounded-lg">
                      <span className="text-sm font-medium block mb-2">Explanation:</span>
                      <p className="text-sm leading-relaxed">{question.explanation}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Topic: {question.topic}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg rounded-xl"
            onClick={() => setLocation("/practice")}
            data-testid="button-practice-again"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Practice Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-xl"
            onClick={() => setLocation("/")}
            data-testid="button-home"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
