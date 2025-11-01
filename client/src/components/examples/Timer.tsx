import Timer from "../Timer";

export default function TimerExample() {
  return (
    <div className="p-8 bg-background">
      <Timer
        initialSeconds={15}
        onTimeUp={() => console.log("Time's up!")}
        isActive={true}
      />
    </div>
  );
}
