export function ScoreboardHeader({
  current,
  total,
  score,
  progress,
}: {
  current: number;
  total: number;
  score: number;
  progress: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-pitch-touchline/30 bg-pitch-deep px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1 font-mono text-2xl font-bold tracking-widest text-pitch-line">
          <span>{String(current).padStart(2, "0")}</span>
          <span className="text-pitch-touchline">/</span>
          <span className="text-pitch-touchline">{String(total).padStart(2, "0")}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] uppercase tracking-widest text-pitch-touchline">Score</span>
          <span className="font-mono text-lg font-bold text-attack">{score}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-pitch-card">
        <div
          className="h-full rounded-full bg-attack transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
