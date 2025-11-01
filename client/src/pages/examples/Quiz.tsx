import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Quiz from "../Quiz";

const mockQuestions = [
  {
    id: 1,
    category: "quant" as const,
    difficulty: "easy" as const,
    question: "What is 25% of 160?",
    options: ["30", "35", "40", "45"],
    answer: "40",
    explanation: "25% = 1/4, so 160/4 = 40",
  },
  {
    id: 2,
    category: "quant" as const,
    difficulty: "medium" as const,
    question: "If a train travels 120 km in 2 hours, what is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    answer: "60 km/h",
    explanation: "Speed = Distance / Time = 120 / 2 = 60 km/h",
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async () => mockQuestions,
      retry: false,
    },
  },
});

export default function QuizExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <Quiz category="quant" onBackToHome={() => console.log("Back to home")} />
    </QueryClientProvider>
  );
}
