import Link from 'next/link';
import { Visit } from '@/lib/types';
import ScoreBadge from './ScoreBadge';
import StarRating from './StarRating';

interface VisitCardProps {
  visit: Visit & { shopName: string };
  showShopName?: boolean;
}

export default function VisitCard({ visit, showShopName = true }: VisitCardProps) {
  return (
    <Link href={`/visits/${visit.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all p-4 flex gap-4 cursor-pointer group">
        {visit.photoUrl ? (
          <img
            src={visit.photoUrl}
            alt={`${visit.style} at ${visit.shopName}`}
            className="w-20 h-20 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-3xl shrink-0">
            🍕
          </div>
        )}

        <div className="flex-1 min-w-0">
          {showShopName && (
            <h3 className="font-bold text-gray-900 group-hover:text-[#c0392b] transition-colors truncate">
              {visit.shopName}
            </h3>
          )}
          <p className="text-sm text-gray-500">{visit.style}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(visit.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="mt-1.5">
            <StarRating score={visit.ratings.overall} size="sm" />
          </div>
          {visit.comment && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic">"{visit.comment}"</p>
          )}
        </div>

        <ScoreBadge score={visit.ratings.overall} size="sm" />
      </div>
    </Link>
  );
}
