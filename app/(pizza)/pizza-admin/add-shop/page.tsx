import AddShopForm from './AddShopForm';

export default function AddShopPage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Add a Shop</h1>
        <p className="text-gray-500 mt-1">Register a new pizza place in the system.</p>
      </div>
      <AddShopForm />
    </div>
  );
}
