interface RatingBarProps {
  label: string;
  score: number;
  max?: number;
}

export default function RatingBar({ label, score, max = 5 }: RatingBarProps) {
  const pct = (score / max) * 100;
  const color =
    pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : pct >= 40 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm text-gray-600 font-medium shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full rating-bar-fill ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-sm font-bold text-gray-800 text-right">{score}</span>
    </div>
  );
}
