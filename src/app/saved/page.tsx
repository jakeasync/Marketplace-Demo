"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Listing } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import {
  Bookmark,
  Share2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedListingsPage() {
  const [savedItems, setSavedItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSaved() {
      try {
        const savedIds: string[] = JSON.parse(
          localStorage.getItem("marketplace_saved_ids") || "[]"
        );

        if (savedIds.length === 0) {
          setSavedItems([]);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/listings");
        if (res.ok) {
          const allListings: Listing[] = await res.json();
          const filtered = allListings.filter((item) =>
            savedIds.includes(item.id)
          );
          setSavedItems(filtered);
        }
      } catch (err) {
        console.error("Error loading saved items", err);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, []);

  const handleRemove = (id: string) => {
    const savedIds: string[] = JSON.parse(
      localStorage.getItem("marketplace_saved_ids") || "[]"
    );
    const updated = savedIds.filter((savedId) => savedId !== id);
    localStorage.setItem("marketplace_saved_ids", JSON.stringify(updated));
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Listing removed from saved items");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-3 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Marketplace
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-[#1877F2] fill-[#1877F2]" />
            Saved Items ({savedItems.length})
          </h1>
          <p className="text-sm text-gray-500">
            Items you bookmarked for later review.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">
          Loading your saved items...
        </div>
      ) : savedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-lg mx-auto my-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#1877F2] mx-auto mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            No saved listings yet
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            When you find items you like, click the &quot;Save&quot; button on their
            detail page to save them here.
          </p>
          <Link href="/">
            <Button variant="facebook">Explore Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  {item.category}
                </span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-gray-600 hover:text-red-600 hover:bg-white transition-colors shadow-xs"
                  title="Remove from saved"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-lg font-black text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/item/${item.id}`}
                    className="text-xs font-semibold text-[#1877F2] hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/item/${item.id}`
                        );
                        showToast("Link copied to clipboard!");
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Share link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

