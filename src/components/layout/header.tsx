"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
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

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#E4E6EB] bg-white px-4 sm:px-6">
      {/* Left: Round Blue 'F' Icon + Marketplace title + Mobile Hamburger */}
      <div className="flex items-center gap-3">
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
          <span className="font-bold text-2xl text-[#050505] tracking-tight">
            Marketplace
          </span>
        </Link>
      </div>

      {/* Right icons: Facebook-style circular #F4F4F4 buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] transition-colors"
          title="Inbox"
        >
          <Mail className="h-5 w-5 text-[#050505]" />
        </button>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-[#050505]" />
        </button>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F4] hover:bg-[#E4E6EB] text-[#050505] cursor-pointer"
          title="Account"
        >
          <User className="h-5 w-5 text-[#050505]" />
        </div>
      </div>
    </header>
  );
}
