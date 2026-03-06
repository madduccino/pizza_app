import Link from 'next/link';
import { getShops, getVisits } from '@/lib/data';

export default function AdminPage() {
  const shops = getShops();
  const visits = getVisits();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin</h1>
        <p className="text-gray-500 mt-1">Manage shops and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="text-4xl font-black text-[#c0392b]">{shops.length}</div>
          <div className="text-sm text-gray-500 mt-1">Shops in System</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="text-4xl font-black text-[#c0392b]">{visits.length}</div>
          <div className="text-sm text-gray-500 mt-1">Ratings Recorded</div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/pizza-admin/add-shop">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all p-6 cursor-pointer group">
            <div className="text-3xl mb-3">🏪</div>
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#c0392b] transition-colors">
              Add a Shop
            </h2>
            <p className="text-sm text-gray-500 mt-1">Register a new pizza place in the system.</p>
          </div>
        </Link>

        <Link href="/pizza-admin/add-rating">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-[#c0392b] hover:shadow-md transition-all p-6 cursor-pointer group">
            <div className="text-3xl mb-3">⭐</div>
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#c0392b] transition-colors">
              Add a Rating
            </h2>
            <p className="text-sm text-gray-500 mt-1">Record a new visit and rate the slice.</p>
          </div>
        </Link>
      </div>

      {/* Recent shops list */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Shops in System</h2>
        {shops.length === 0 ? (
          <p className="text-gray-400 text-sm">No shops yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {shops.map((shop) => (
              <li key={shop.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/shops/${shop.id}`} className="font-medium text-gray-800 hover:text-[#c0392b] transition-colors">
                    {shop.name}
                  </Link>
                  <p className="text-xs text-gray-400">{shop.address}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {visits.filter((v) => v.shopId === shop.id).length} visits
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
