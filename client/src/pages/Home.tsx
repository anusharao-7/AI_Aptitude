import { Card } from "@/components/ui/card";
import { Brain, Calculator, MessageSquare, Code } from "lucide-react";
import { categoryDisplayNames } from "@shared/schema";

interface HomeProps {
  onCategorySelect: (category: string) => void;
}

export default function Home({ onCategorySelect }: HomeProps) {
  const categories = [
    {
      id: "quant",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "logical",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "verbal",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "technical",
      icon: Code,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-title">
            AI Aptitude
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-subtitle">
            Choose a category to start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                onClick={() => onCategorySelect(category.id)}
                data-testid={`card-category-${category.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-md ${category.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {categoryDisplayNames[category.id]}
                  </h2>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
