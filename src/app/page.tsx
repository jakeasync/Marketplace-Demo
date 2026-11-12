"use client";

import { useSearchParams } from "next/navigation";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { MobileCategoryPills } from "@/components/layout/sidebar";
import { Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";

  return (
    <div className="space-y-4">
      {/* Mobile horizontal category pills */}
      <MobileCategoryPills />

      {/* Title placed directly at the top with clean styling */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {query ? `Search results for "${query}"` : "Today's picks"}
        </h1>
      </div>

      <ItemGrid initialCategory={category} searchQuery={query} />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">
          Loading picks...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
