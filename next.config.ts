import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0, // never serve stale router cache for dynamic pages
    },
  },
};

export default nextConfig;
