import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Clock, Target, TrendingUp, BookOpen, Code, MessageSquare, Calculator } from "lucide-react";
import heroBackground from "@assets/generated_images/Hero_background_for_AI_Aptitude_6d0cc960.png";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Explanations",
      description: "Get detailed explanations for every question to understand concepts deeply and learn from mistakes."
    },
    {
      icon: Clock,
      title: "Timed Practice Sessions",
      description: "Practice with realistic time constraints to prepare for actual aptitude tests and improve speed."
    },
    {
      icon: Target,
      title: "Personalized Insights",
      description: "Track your performance and identify weak areas with comprehensive analytics and progress tracking."
    }
  ];

  const topics = [
    {
      category: "Quantitative Aptitude",
      icon: Calculator,
      subtopics: ["Percentages", "Ratio & Proportion", "Time & Work", "Speed & Distance", "Profit & Loss"]
    },
    {
      category: "Logical Reasoning",
      icon: Brain,
      subtopics: ["Pattern Recognition", "Series Completion", "Blood Relations", "Coding-Decoding", "Puzzles"]
    },
    {
      category: "Verbal Ability",
      icon: MessageSquare,
      subtopics: ["Reading Comprehension", "Sentence Correction", "Vocabulary", "Para Jumbles", "Synonyms & Antonyms"]
    },
    {
      category: "Technical MCQs",
      icon: Code,
      subtopics: ["C Programming", "DBMS", "OOPs Concepts", "Data Structures", "Computer Networks"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            AI Aptitude
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Smart AI-Powered Aptitude Practice Platform
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Master quantitative aptitude, logical reasoning, verbal ability, and technical concepts with instant feedback and detailed explanations. No signup required.
          </p>
          <Link href="/practice">
            <Button size="lg" className="text-lg px-12 py-6 h-auto rounded-xl" data-testid="button-start-practice">
              Start Practice
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" data-testid="text-features-heading">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover-elevate" data-testid={`card-feature-${index}`}>
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-card py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" data-testid="text-topics-heading">Topics Covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <Card key={index} className="p-6" data-testid={`card-topic-${index}`}>
                <div className="flex items-center gap-3 mb-4">
                  <topic.icon className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold text-lg">{topic.category}</h3>
                </div>
                <ul className="space-y-2">
                  {topic.subtopics.map((subtopic, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {subtopic}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-heading">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          No signup, no subscription. Just pure learning and practice.
        </p>
        <Link href="/practice">
          <Button size="lg" className="text-lg px-12 py-6 h-auto rounded-xl" data-testid="button-get-started">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
