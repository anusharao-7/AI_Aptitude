import ResultScreen from "../ResultScreen";

export default function ResultScreenExample() {
  return (
    <ResultScreen
      score={7}
      totalQuestions={10}
      onRestart={() => console.log("Restart quiz")}
      onBackToHome={() => console.log("Back to home")}
    />
  );
}
