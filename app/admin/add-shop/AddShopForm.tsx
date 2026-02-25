'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddShopForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    zipCode: '',
    photoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setSuccess(`"${data.name}" added successfully!`);
        setForm({ name: '', address: '', zipCode: '', photoUrl: '' });
        setTimeout(() => router.push(`/shops/${data.id}`), 1500);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Shop Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Joe's Pizza"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="e.g. 7 Carmine St, New York, NY 10014"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Zip Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="zipCode"
          value={form.zipCode}
          onChange={handleChange}
          required
          placeholder="e.g. 10014"
          pattern="[0-9]{5}"
          maxLength={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Photo URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          name="photoUrl"
          value={form.photoUrl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:border-transparent"
        />
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#c0392b] hover:bg-[#96281b] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Adding…' : 'Add Shop'}
        </button>
        <a
          href="/admin"
          className="px-6 py-3 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-center"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
