import { getVisitById, getShopById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScoreBadge from '@/components/ScoreBadge';
import StarRating from '@/components/StarRating';
import RatingBar from '@/components/RatingBar';

interface VisitPageProps {
  params: Promise<{ id: string }>;
}

export default async function VisitPage({ params }: VisitPageProps) {
  const { id } = await params;
  const visit = getVisitById(id);
  if (!visit) notFound();

  const shop = getShopById(visit.shopId);

  const formattedDate = new Date(visit.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/shops" className="hover:text-[#c0392b]">Shops</Link>
        <span>/</span>
        {shop && (
          <>
            <Link href={`/shops/${shop.id}`} className="hover:text-[#c0392b]">{shop.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700">{visit.style}</span>
      </div>

      {/* Photo */}
      {visit.photoUrl ? (
        <img
          src={visit.photoUrl}
          alt={`${visit.style} at ${shop?.name}`}
          className="w-full h-72 object-cover rounded-2xl"
        />
      ) : (
        <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-orange-100 to-red-200 flex items-center justify-center text-8xl">
          🍕
        </div>
      )}

      {/* Header info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {shop && (
              <Link href={`/shops/${shop.id}`} className="text-[#c0392b] hover:underline font-bold text-2xl">
                {shop.name}
              </Link>
            )}
            <p className="text-lg text-gray-700 font-medium mt-1">{visit.style}</p>
            <p className="text-sm text-gray-400 mt-1">{formattedDate}</p>
            {shop && <p className="text-sm text-gray-400">{shop.address}</p>}
          </div>
          <ScoreBadge score={visit.ratings.overall} size="lg" />
        </div>

        <div className="mt-3">
          <StarRating score={visit.ratings.overall} size="lg" />
        </div>
      </div>

      {/* Ratings breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Ratings Breakdown</h2>
        <div className="space-y-4">
          <RatingBar label="Overall" score={visit.ratings.overall} />
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <RatingBar label="Dough / Crust" score={visit.ratings.dough} />
            <RatingBar label="Sauce" score={visit.ratings.sauce} />
            <RatingBar label="Cheese" score={visit.ratings.cheese} />
            <RatingBar label="Foldability" score={visit.ratings.foldability} />
          </div>
        </div>

        {/* Score grid */}
        <div className="mt-6 grid grid-cols-5 gap-2">
          {[
            { label: 'Dough', score: visit.ratings.dough },
            { label: 'Sauce', score: visit.ratings.sauce },
            { label: 'Cheese', score: visit.ratings.cheese },
            { label: 'Fold', score: visit.ratings.foldability },
            { label: 'Overall', score: visit.ratings.overall },
          ].map(({ label, score }) => (
            <div key={label} className="text-center bg-gray-50 rounded-xl p-3">
              <div
                className={`text-xl font-black ${
                  score >= 4.5 ? 'text-green-600' : score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-600' : 'text-orange-500'
                }`}
              >
                {score}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment */}
      {visit.comment && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Notes</h2>
          <p className="text-gray-700 leading-relaxed italic">"{visit.comment}"</p>
        </div>
      )}

      {/* Back link */}
      {shop && (
        <div className="text-center">
          <Link
            href={`/shops/${shop.id}`}
            className="inline-flex items-center gap-2 text-[#c0392b] hover:underline font-medium"
          >
            ← All visits at {shop.name}
          </Link>
        </div>
      )}

    </div>
  );
}
