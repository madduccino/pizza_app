import { getShops, getVisitsByShopId, getAverageRating } from '@/lib/data';
import Link from 'next/link';
import ScoreBadge from '@/components/ScoreBadge';
import StarRating from '@/components/StarRating';

interface ShopsPageProps {
  searchParams: Promise<{ name?: string; zip?: string; style?: string }>;
}

export default async function ShopsPage({ searchParams }: ShopsPageProps) {
  const params = await searchParams;
  const shops = getShops();

  const shopsWithData = shops
    .map((shop) => {
      const visits = getVisitsByShopId(shop.id);
      const avgRating = getAverageRating(visits);
      const styles = [...new Set(visits.map((v) => v.style))];
      return { ...shop, visits, avgRating, styles };
    })
    .filter((shop) => {
      if (params.name && !shop.name.toLowerCase().includes(params.name.toLowerCase())) return false;
      if (params.zip && !shop.zipCode.includes(params.zip)) return false;
      if (params.style && !shop.styles.some((s) => s.toLowerCase().includes(params.style!.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => b.avgRating - a.avgRating);

  const hasFilter = params.name || params.zip || params.style;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Pizza Shops</h1>
        <p className="text-gray-500 mt-1">{shopsWithData.length} shop{shopsWithData.length !== 1 ? 's' : ''} visited</p>
      </div>

      {/* Active filters */}
      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Filters:</span>
          {params.name && (
            <span className="bg-red-100 text-[#c0392b] text-xs font-medium px-3 py-1 rounded-full">
              Name: {params.name}
            </span>
          )}
          {params.zip && (
            <span className="bg-red-100 text-[#c0392b] text-xs font-medium px-3 py-1 rounded-full">
              Zip: {params.zip}
            </span>
          )}
          {params.style && (
            <span className="bg-red-100 text-[#c0392b] text-xs font-medium px-3 py-1 rounded-full">
              Style: {params.style}
            </span>
          )}
          <Link href="/shops" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Clear filters
          </Link>
        </div>
      )}

      {/* Shop list */}
      {shopsWithData.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🍕</div>
          <p className="text-lg">No shops found.</p>
          <Link href="/shops" className="text-sm text-[#c0392b] hover:underline mt-2 inline-block">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shopsWithData.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all overflow-hidden cursor-pointer group h-full flex flex-col">
                {shop.photoUrl ? (
                  <img src={shop.photoUrl} alt={shop.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center text-5xl">
                    🏪
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 group-hover:text-[#c0392b] transition-colors truncate">
                        {shop.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{shop.address}</p>
                    </div>
                    {shop.avgRating > 0 && <ScoreBadge score={shop.avgRating} size="sm" />}
                  </div>

                  <div className="mt-3 flex-1">
                    {shop.avgRating > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarRating score={shop.avgRating} size="sm" />
                        <span className="text-xs text-gray-400">avg</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {shop.styles.slice(0, 3).map((style) => (
                        <span key={style} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    {shop.visits.length} visit{shop.visits.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
