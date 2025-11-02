import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Brain, MessageSquare, Code, ArrowLeft } from "lucide-react";

const categories = [
  { id: "Quantitative", name: "Quantitative", icon: Calculator, color: "text-chart-1" },
  { id: "Logical", name: "Logical Reasoning", icon: Brain, color: "text-chart-3" },
  { id: "Verbal", name: "Verbal Ability", icon: MessageSquare, color: "text-chart-2" },
  { id: "Technical", name: "Technical MCQs", icon: Code, color: "text-chart-4" }
];

export default function PracticeSetup() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [questionCount, setQuestionCount] = useState<number>(10);

  const { data: topics = [] } = useQuery<string[]>({
    queryKey: ["topics", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set("category", selectedCategory);
      }
      const res = await fetch(`/api/topics?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch topics");
      return await res.json();
    },
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    setSelectedTopic("");
  }, [selectedCategory]);

  const handleStart = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      topic: selectedTopic,
      difficulty,
      count: questionCount.toString(),
    });
    setLocation(`/practice/questions?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-setup-heading">Configure Your Practice</h1>
          <p className="text-muted-foreground mb-8">Select your preferences to start practicing</p>

          <div className="space-y-8">
            <div>
              <Label className="text-sm font-medium mb-3 block">Select Category</Label>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="h-auto p-6 flex flex-col items-center gap-3"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedTopic("");
                    }}
                    data-testid={`button-category-${category.id.toLowerCase()}`}
                  >
                    <category.icon className={`w-8 h-8 ${selectedCategory === category.id ? "" : category.color}`} />
                    <span className="font-semibold">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {selectedCategory && topics.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block" htmlFor="topic-select">
                  Select Topic
                </Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger id="topic-select" className="w-full" data-testid="select-topic">
                    <SelectValue placeholder="Choose a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic} data-testid={`option-topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
              <div className="flex gap-3">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    className="flex-1 rounded-full"
                    onClick={() => setDifficulty(level)}
                    data-testid={`button-difficulty-${level.toLowerCase()}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Number of Questions</Label>
              <div className="grid grid-cols-3 gap-4">
                {[10, 25, 50].map((count) => (
                  <Button
                    key={count}
                    variant={questionCount === count ? "default" : "outline"}
                    className="h-16 text-lg font-semibold"
                    onClick={() => setQuestionCount(count)}
                    data-testid={`button-count-${count}`}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full py-6 text-lg rounded-xl"
              disabled={!selectedCategory || !selectedTopic}
              onClick={handleStart}
              data-testid="button-start-practice"
            >
              Start Practice Session
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
