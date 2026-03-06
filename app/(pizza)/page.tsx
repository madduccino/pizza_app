import { getRecentVisits, getElite8, getShops, getVisits } from '@/lib/data';
import SearchSection from './SearchSection';
import Link from 'next/link';
import ScoreBadge from '@/components/ScoreBadge';
import StarRating from '@/components/StarRating';

export default function HomePage() {
  const recentVisits = getRecentVisits(3);
  const elite8 = getElite8();
  const totalShops = getShops().length;
  const totalSlices = getVisits().length;

  return (
    <div className="space-y-12">

      {/* Hero */}
      <section className="text-center py-10">
        <div className="text-6xl mb-4">🍕</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#c0392b] mb-3">The Foldable</h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Honest ratings of NYC pizza slices — judged on dough, sauce, cheese, and the all-important fold.
        </p>

        {/* Quick stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-black text-[#c0392b]">{totalShops}</div>
            <div className="text-sm text-gray-500 mt-0.5">Shops Visited</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-black text-[#c0392b]">{totalSlices}</div>
            <div className="text-sm text-gray-500 mt-0.5">Slices Rated</div>
          </div>
        </div>
      </section>

      {/* Search */}
      <SearchSection />

      {/* Recent Reviews */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Recent Reviews</h2>
          <Link href="/shops" className="text-sm text-[#c0392b] hover:underline font-medium">
            View all shops →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recentVisits.map((visit) => (
            <Link key={visit.id} href={`/visits/${visit.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all p-4 h-full flex flex-col cursor-pointer group">
                {visit.photoUrl ? (
                  <img
                    src={visit.photoUrl}
                    alt={visit.shopName}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-5xl mb-3">
                    🍕
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#c0392b] transition-colors truncate">
                      {visit.shopName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{visit.style}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(visit.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ScoreBadge score={visit.ratings.overall} size="sm" />
                </div>
                {visit.comment && (
                  <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">"{visit.comment}"</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Elite 8 */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Elite 8
          </h2>
          <p className="text-sm text-gray-500 mt-1">The 8 best individual slices ever rated</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {elite8.map((visit, index) => (
            <Link key={visit.id} href={`/visits/${visit.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all p-4 flex items-center gap-4 cursor-pointer group">
                <div
                  className={`text-lg font-black w-8 text-center shrink-0 ${
                    index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'
                  }`}
                >
                  #{index + 1}
                </div>

                {visit.photoUrl ? (
                  <img
                    src={visit.photoUrl}
                    alt={visit.shopName}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-2xl shrink-0">
                    🍕
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#c0392b] transition-colors truncate text-sm">
                    {visit.shopName}
                  </h3>
                  <p className="text-xs text-gray-500">{visit.style}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating score={visit.ratings.overall} size="sm" />
                    <span className="text-xs text-gray-400">
                      {new Date(visit.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <ScoreBadge score={visit.ratings.overall} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
