import type { NextConfig } from "next";

const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
const backendUrl = rawBackendUrl?.endsWith("/api")
  ? rawBackendUrl.slice(0, -4)
  : rawBackendUrl;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

