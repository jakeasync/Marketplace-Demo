import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint warnings/errors from failing the production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent TypeScript warnings from failing the production build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
