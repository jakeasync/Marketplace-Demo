import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShellLayout } from "@/components/layout/shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse and create listings in your local area with real-time preview and messaging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#F0F2F5] text-[#050505] font-sans antialiased">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
              Loading...
            </div>
          }
        >
          <ShellLayout>{children}</ShellLayout>
        </Suspense>
      </body>
    </html>
  );
}
