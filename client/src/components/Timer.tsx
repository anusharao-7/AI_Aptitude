import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ initialSeconds, onTimeUp, isActive }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp]);

  const isWarning = seconds <= 10 && seconds > 0;
  const isDanger = seconds <= 5 && seconds > 0;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
        isDanger
          ? "bg-destructive/10 border-destructive text-destructive"
          : isWarning
          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
          : "bg-card border-card-border text-card-foreground"
      }`}
      data-testid="timer"
    >
      <Clock className="w-5 h-5" />
      <span className="font-semibold text-lg tabular-nums" data-testid="timer-seconds">
        {seconds}s
      </span>
    </div>
  );
}
