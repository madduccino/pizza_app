'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shop } from '@/lib/types';

const SLICE_STYLES = ['NY Slice', 'Sicilian', 'Pepperoni Slice', 'White Slice', 'Grandma Slice', 'Other'];

interface ScoreInputProps {
  label: string;
  name: string;
  value: number | '';
  onChange: (name: string, value: number | '') => void;
  emoji?: string;
}

function ScoreInput({ label, name, value, onChange, emoji }: ScoreInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {emoji} {label} <span className="text-red-500">*</span>
        <span className="font-normal text-gray-400 ml-1">(0–5, half steps OK)</span>
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={value === '' ? 0 : value}
          onChange={(e) => onChange(name, parseFloat(e.target.value))}
          className="flex-1 accent-[#c0392b]"
        />
        <div className="w-12 h-12 rounded-full bg-[#c0392b] text-white font-bold text-lg flex items-center justify-center shrink-0">
          {value === '' ? '—' : value}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}

interface AddRatingFormProps {
  shops: Shop[];
}

export default function AddRatingForm({ shops }: AddRatingFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    shopId: '',
    date: today,
    style: '',
    photoUrl: '',
    comment: '',
  });

  const [ratings, setRatings] = useState<Record<string, number | ''>>({
    overall: '',
    dough: '',
    sauce: '',
    cheese: '',
    foldability: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRating = (name: string, value: number | '') => {
    setRatings((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(ratings).some((v) => v === '')) {
      setError('Please set all rating scores.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ratings }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setSuccess('Rating saved!');
        setTimeout(() => router.push(`/visits/${data.id}`), 1200);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Shop */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Shop <span className="text-red-500">*</span>
        </label>
        {shops.length === 0 ? (
          <p className="text-sm text-red-500">
            No shops in system. <a href="/pizza-admin/add-shop" className="underline">Add one first.</a>
          </p>
        ) : (
          <select
            name="shopId"
            value={form.shopId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] bg-white"
          >
            <option value="">Select a shop…</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} — {shop.address}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          max={today}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
        />
      </div>

      {/* Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Slice Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {SLICE_STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, style: s }))}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                form.style === s
                  ? 'bg-[#c0392b] text-white border-[#c0392b]'
                  : 'border-gray-300 text-gray-600 hover:border-[#c0392b]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          name="style"
          value={form.style}
          onChange={handleChange}
          required
          placeholder="Or type a custom style…"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
        />
      </div>

      {/* Photo URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Photo URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          name="photoUrl"
          value={form.photoUrl}
          onChange={handleChange}
          placeholder="https://example.com/slice.jpg"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-base font-bold text-gray-700 mb-5">Ratings</h3>
        <div className="space-y-6">
          <ScoreInput label="Overall" name="overall" value={ratings.overall} onChange={handleRating} emoji="⭐" />
          <ScoreInput label="Dough / Crust" name="dough" value={ratings.dough} onChange={handleRating} emoji="🫓" />
          <ScoreInput label="Sauce" name="sauce" value={ratings.sauce} onChange={handleRating} emoji="🍅" />
          <ScoreInput label="Cheese" name="cheese" value={ratings.cheese} onChange={handleRating} emoji="🧀" />
          <ScoreInput label="Foldability" name="foldability" value={ratings.foldability} onChange={handleRating} emoji="🗂️" />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Comments <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
          placeholder="What stood out? Anything notable about this visit?"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] resize-none"
        />
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={loading || shops.length === 0}
          className="flex-1 bg-[#c0392b] hover:bg-[#96281b] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Saving…' : 'Save Rating'}
        </button>
        <a
          href="/pizza-admin"
          className="px-6 py-3 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-center"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
