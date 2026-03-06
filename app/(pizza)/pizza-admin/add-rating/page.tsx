import { getShops } from '@/lib/data';
import AddRatingForm from './AddRatingForm';

export default function AddRatingPage() {
  const shops = getShops();
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Add a Rating</h1>
        <p className="text-gray-500 mt-1">Record a new visit and rate the slice.</p>
      </div>
      <AddRatingForm shops={shops} />
    </div>
  );
}
