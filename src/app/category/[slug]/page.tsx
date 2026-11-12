import { ItemGrid } from "@/components/marketplace/item-grid";
import { MobileCategoryPills } from "@/components/layout/sidebar";
import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <MobileCategoryPills />
      </Suspense>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {formattedTitle}
        </h1>
      </div>

      <ItemGrid initialCategory={formattedTitle} />
    </div>
  );
}
