interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color =
    score >= 4.5 ? 'bg-green-600' : score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-orange-500';

  const sizeClass =
    size === 'sm'
      ? 'w-10 h-10 text-sm'
      : size === 'lg'
      ? 'w-20 h-20 text-3xl font-black'
      : 'w-14 h-14 text-xl font-bold';

  return (
    <div
      className={`${color} ${sizeClass} text-white rounded-full flex items-center justify-center font-bold shadow-md shrink-0`}
    >
      {score.toFixed(1)}
    </div>
  );
}
