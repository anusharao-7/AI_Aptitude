import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {selectedCategory ? (
          <Quiz category={selectedCategory} onBackToHome={handleBackToHome} />
        ) : (
          <Home onCategorySelect={handleCategorySelect} />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
