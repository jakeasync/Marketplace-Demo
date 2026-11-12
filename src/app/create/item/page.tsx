"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  "Electronics",
  "Furniture",
  "Vehicles",
  "Apparel",
  "Bicycles",
  "Classifieds",
  "Free Stuff",
];

function CreateItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Electronics";

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerName, setSellerName] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide a title");
      return;
    }
    if (price === "" || isNaN(Number(price))) {
      setError("Please provide a valid price");
      return;
    }
    if (!sellerEmail.trim() || !sellerEmail.includes("@")) {
      setError("Please provide a valid email address");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        price: Number(price),
        category,
        description: description.trim() || "No description provided.",
        location: location.trim(),
        seller_email: sellerEmail.trim(),
        seller_name: sellerName.trim() || "Marketplace Seller",
        image_url:
          imageUrl ||
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create listing");
      }

      const created = await res.json();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/item/${created.id}`);
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not post listing");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to listing types</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Item for sale</h1>
            <p className="text-sm text-gray-500 mt-1">
              Provide as many details as possible to help buyers find your item.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Listing created successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo Upload Dropzone */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Photos <span className="text-gray-400 font-normal">· Photos · 0 / 10</span>
              </label>

              {imageUrl ? (
                <div className="relative rounded-xl border border-gray-200 overflow-hidden group aspect-video max-h-64 bg-gray-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Upload preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-3 right-3 rounded-full bg-black/70 text-white p-1.5 hover:bg-black transition-colors"
                    title="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin text-[#1877F2] mb-2" />
                      <p className="text-sm font-medium text-gray-600">Uploading photo...</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs mb-3 text-gray-500">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        Add Photos or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP up to 5MB</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Title
              </label>
              <Input
                type="text"
                placeholder="What are you selling?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Price ($ USD)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Category
                </label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Location
              </label>
              <Input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Description
              </label>
              <Textarea
                placeholder="Tell buyers about the condition, features, reason for selling, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Seller Contact Info */}
            <div className="border-t border-gray-200 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Seller Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="facebook"
                size="lg"
                disabled={submitting || success}
                className="w-full text-base font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publishing Listing...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Preview Column (Real-time synchronization) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
              <Eye className="h-4 w-4 text-[#1877F2]" />
              <span>Real-time Preview</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <UploadCloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Photo preview will appear here</p>
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                  {category}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="text-2xl font-black text-gray-900">
                  {price ? formatPrice(price) : "$0"}
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-snug">
                  {title || "Listing Title Preview"}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>{location || "Location not specified"}</span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {description || "Description preview will appear here as you type."}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold text-sm">
                    {sellerName ? sellerName[0].toUpperCase() : "S"}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">
                      {sellerName || "Seller Name"}
                    </p>
                    <p className="text-gray-500">{sellerEmail || "seller@example.com"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateItemPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#1877F2]" />
        </div>
      }
    >
      <CreateItemForm />
    </Suspense>
  );
}

