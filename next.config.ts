import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  async rewrites() {
    const target = process.env.API_PROXY_TARGET ?? "http://localhost:3000";
    return [
      {
        source: "/admin/reviews",
        destination: "/admin/Reviews",
      },
      {
        source: "/admin/reviews/:path*",
        destination: "/admin/Reviews/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
