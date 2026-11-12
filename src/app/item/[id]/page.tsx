"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Listing, Message } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  Share2,
  Bookmark,
  CheckCircle,
} from "lucide-react";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default function ItemDetailPage({ params }: ItemPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Messaging state
  const [messages, setMessages] = useState<Message[]>([]);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [messageText, setMessageText] = useState("Hi, is this still available?");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if current item is saved
    try {
      const savedIds: string[] = JSON.parse(
        localStorage.getItem("marketplace_saved_ids") || "[]"
      );
      setIsSaved(savedIds.includes(id));
    } catch {
      // Ignore localStorage errors
    }
  }, [id]);

  const toggleSave = () => {
    try {
      const savedIds: string[] = JSON.parse(
        localStorage.getItem("marketplace_saved_ids") || "[]"
      );
      let updated: string[];
      if (savedIds.includes(id)) {
        updated = savedIds.filter((itemKey) => itemKey !== id);
        setIsSaved(false);
        triggerToast("Removed from saved items");
      } else {
        updated = [...savedIds, id];
        setIsSaved(true);
        triggerToast("Saved to your Marketplace collection!");
      }
      localStorage.setItem("marketplace_saved_ids", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Listing link copied to clipboard!");
    }
  };

  useEffect(() => {
    async function loadItemAndMessages() {
      setLoading(true);
      setError(null);
      try {
        const [itemRes, msgRes] = await Promise.all([
          fetch(`/api/listings/${id}`),
          fetch(`/api/messages?listing_id=${id}`),
        ]);

        if (!itemRes.ok) {
          throw new Error("Listing not found or has been removed.");
        }

        const itemData = await itemRes.json();
        setItem(itemData);

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading listing");
      } finally {
        setLoading(false);
      }
    }

    loadItemAndMessages();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      alert("Please enter a valid email address to message the seller.");
      return;
    }
    if (!messageText.trim()) return;

    setSendingMessage(true);
    setMessageSuccess(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          buyer_email: buyerEmail.trim(),
          seller_email: item?.seller_email,
          message: messageText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Could not deliver message to seller.");
      }

      const createdMsg = await res.json();
      setMessages((prev) => [...prev, createdMsg]);
      setMessageSuccess(true);
      setMessageText("Hi, is this still available?");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin text-[#1877F2] mb-3" />
        <p className="font-semibold text-sm">Loading listing details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-xs">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Item Unavailable</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "Listing not found"}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-5 py-2.5 font-semibold text-white hover:bg-[#166fe5]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-3 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Left Column: Big Image Display */}
        <div className="lg:col-span-7 bg-black flex items-center justify-center min-h-[280px] sm:min-h-[400px] lg:min-h-[560px] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title}
            className="max-h-[360px] sm:max-h-[500px] lg:max-h-[600px] w-full object-contain"
          />
        </div>

        {/* Right Column: Information, Seller Profile & Messaging */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto lg:max-h-[calc(100vh-6rem)]">
          <div className="space-y-6">
            {/* Title & Price Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {formatPrice(item.price)}
              </p>

              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={toggleSave}
                className="flex-1 gap-1.5"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1 gap-1.5"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Details</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Seller Information */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] font-black text-lg">
                  {item.seller_name ? item.seller_name[0].toUpperCase() : "S"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {item.seller_name || "Marketplace Seller"}
                  </h4>
                  <p className="text-xs text-gray-500">{item.seller_email}</p>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Identity verified
                  </p>
                </div>
              </div>
            </div>

            {/* Message Seller Form */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Send seller a message
              </h3>

              {messageSuccess && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-2.5 text-xs text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Message delivered to seller!</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Contact Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Ask about availability, pickup, condition..."
                    className="text-xs"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="facebook"
                  disabled={sendingMessage}
                  className="w-full gap-2 font-semibold text-sm"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Conversation history preview */}
            {messages.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Previous Inquiries ({messages.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg bg-gray-50 border border-gray-200 p-2.5 text-xs text-gray-700"
                    >
                      <div className="flex justify-between font-semibold text-gray-900 mb-1">
                        <span>{m.buyer_email}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

