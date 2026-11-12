"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Mail,
  User,
  Menu,
} from "lucide-react";

export function Header({ onToggleMenu }: { onToggleMenu?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#E4E6EB] bg-white px-3 sm:px-6">
      {/* Left: Hamburger + Marketplace Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onToggleMenu && (
          <button
            onClick={onToggleMenu}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-bold text-xl sm:text-2xl text-[#050505] tracking-tight">
            Marketplace
          </span>
        </Link>
      </div>

      {/* Middle: Prominent Facebook Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search Marketplace"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-[#F0F2F5] py-2 pl-9 pr-4 text-xs sm:text-sm text-[#050505] placeholder-gray-500 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
        />
      </form>

      {/* Right icons: Facebook circular buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] transition-colors"
          title="Inbox"
        >
          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#050505]" />
        </button>

        <button
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#050505]" />
        </button>

        <div
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] cursor-pointer"
          title="Account"
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#050505]" />
        </div>
      </div>
    </header>
  );
}
