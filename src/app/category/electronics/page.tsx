import { ItemGrid } from "@/components/marketplace/item-grid";

export default function ElectronicsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Electronics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Phones, computers, audio equipment, gaming consoles and accessories.
        </p>
      </div>

      <ItemGrid initialCategory="Electronics" />
    </div>
  );
}

