"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Listing } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";

interface ItemGridProps {
  initialCategory?: string;
  searchQuery?: string;
}

export function ItemGrid({ initialCategory = "all", searchQuery = "" }: ItemGridProps) {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (initialCategory && initialCategory.toLowerCase() !== "all") {
          params.append("category", initialCategory);
        }
        if (searchQuery && searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        const res = await fetch(`/api/listings?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to load listings");
        }
        const data = await res.json();
        if (isMounted) {
          setItems(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error fetching items");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchListings();
    return () => {
      isMounted = false;
    };
  }, [initialCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#1877F2] mb-3" />
        <p className="font-medium text-xs">Loading picks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-red-900 mb-1">Could not load items</h3>
        <p className="text-xs text-red-700">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-lg mx-auto my-8">
        <h3 className="text-base font-bold text-gray-900 mb-1">No listings found</h3>
        <p className="text-xs text-gray-500 mb-5">
          We couldn&apos;t find any items matching your criteria.
        </p>
        <Link
          href="/create/item"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#166fe5] transition-colors"
        >
          Create First Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/item/${item.id}`}
          className="group flex flex-col rounded-2xl bg-white p-2.5 transition-all hover:shadow-md cursor-pointer border border-transparent hover:border-gray-100"
        >
          {/* Portrait Image Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#E8F0FE]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          </div>

          {/* Details directly underneath image */}
          <div className="pt-2.5 pb-1 px-1 flex flex-col">
            <span className="text-base font-bold text-gray-900 leading-tight">
              {formatPrice(item.price)}
            </span>

            <p className="mt-1 line-clamp-1 text-xs text-gray-500 font-normal">
              {item.title}
            </p>

            <p className="mt-0.5 text-xs text-gray-400 font-normal truncate">
              {item.location || "Palo Alto, CA"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
