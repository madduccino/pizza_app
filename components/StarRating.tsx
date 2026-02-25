interface StarRatingProps {
  score: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ score, max = 5, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (score >= i) {
      stars.push(<span key={i} className="star-filled">★</span>);
    } else if (score >= i - 0.5) {
      stars.push(<span key={i} className="star-filled opacity-60">★</span>);
    } else {
      stars.push(<span key={i} className="star-empty">★</span>);
    }
  }

  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`}>
      {stars}
    </span>
  );
}
