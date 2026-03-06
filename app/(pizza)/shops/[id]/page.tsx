import { getShopById, getVisitsByShopId, getAverageRating } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScoreBadge from '@/components/ScoreBadge';
import StarRating from '@/components/StarRating';
import RatingBar from '@/components/RatingBar';
import VisitCard from '@/components/VisitCard';

interface ShopPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) notFound();

  const visits = getVisitsByShopId(id);
  const avgRating = getAverageRating(visits);

  // Average each sub-rating
  const subAvgs = visits.length > 0 ? {
    dough: Math.round((visits.reduce((a, v) => a + v.ratings.dough, 0) / visits.length) * 10) / 10,
    sauce: Math.round((visits.reduce((a, v) => a + v.ratings.sauce, 0) / visits.length) * 10) / 10,
    cheese: Math.round((visits.reduce((a, v) => a + v.ratings.cheese, 0) / visits.length) * 10) / 10,
    foldability: Math.round((visits.reduce((a, v) => a + v.ratings.foldability, 0) / visits.length) * 10) / 10,
  } : null;

  // Styles at this shop
  const styleMap = new Map<string, number[]>();
  for (const v of visits) {
    const arr = styleMap.get(v.style) ?? [];
    arr.push(v.ratings.overall);
    styleMap.set(v.style, arr);
  }
  const styleRatings = Array.from(styleMap.entries()).map(([style, scores]) => ({
    style,
    avg: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    count: scores.length,
  })).sort((a, b) => b.avg - a.avg);

  const sortedVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/shops" className="hover:text-[#c0392b]">Shops</Link>
        <span>/</span>
        <span className="text-gray-700">{shop.name}</span>
      </div>

      {/* Shop header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {shop.photoUrl ? (
          <img src={shop.photoUrl} alt={shop.name} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-orange-100 to-red-200 flex items-center justify-center text-7xl">
            🏪
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
              <p className="text-gray-500 mt-1">{shop.address}</p>
              <p className="text-sm text-gray-400 mt-0.5">ZIP: {shop.zipCode}</p>
            </div>
            {avgRating > 0 && <ScoreBadge score={avgRating} size="lg" />}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div><span className="font-semibold">{visits.length}</span> visit{visits.length !== 1 ? 's' : ''}</div>
            {avgRating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating score={avgRating} size="sm" />
                <span className="text-gray-400">overall avg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {visits.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No visits recorded yet.</p>
          <Link href="/pizza-admin/add-rating" className="text-[#c0392b] hover:underline text-sm mt-2 inline-block">
            Add a rating →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">

          {/* Average ratings breakdown */}
          {subAvgs && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Average Ratings</h2>
              <div className="space-y-3">
                <RatingBar label="Overall" score={avgRating} />
                <RatingBar label="Dough / Crust" score={subAvgs.dough} />
                <RatingBar label="Sauce" score={subAvgs.sauce} />
                <RatingBar label="Cheese" score={subAvgs.cheese} />
                <RatingBar label="Foldability" score={subAvgs.foldability} />
              </div>
            </div>
          )}

          {/* Styles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Slice Types</h2>
            <div className="space-y-3">
              {styleRatings.map(({ style, avg, count }) => (
                <div key={style} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-700">{style}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {count} visit{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating score={avg} size="sm" />
                    <span className="text-sm font-bold text-gray-700">{avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visit history */}
      {sortedVisits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Visit History</h2>
          <div className="space-y-3">
            {sortedVisits.map((visit) => (
              <VisitCard key={visit.id} visit={{ ...visit, shopName: shop.name }} showShopName={false} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
