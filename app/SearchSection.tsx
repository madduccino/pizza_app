'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchSection() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [style, setStyle] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (zipCode) params.set('zip', zipCode);
    if (style) params.set('style', style);
    router.push(`/shops?${params.toString()}`);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Find a Pizza</h2>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Shop name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Zip code…"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full md:w-36 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Style (NY, Sicilian…)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-[#c0392b] hover:bg-[#96281b] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Search
        </button>
      </form>
    </section>
  );
}
