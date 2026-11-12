"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header onToggleMenu={() => setMobileMenuOpen((prev) => !prev)} />
      <div className="flex w-full">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-3.5rem)] px-4 py-3 sm:px-6 sm:py-4 pb-16 lg:pb-6">
          {children}
        </main>
      </div>
    </>
  );
}

