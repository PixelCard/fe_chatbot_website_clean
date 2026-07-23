import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  async rewrites() {
    const target = process.env.API_PROXY_TARGET ?? "http://localhost:3000";
    return [
      {
        source: "/admin",
        destination: "/Admin/dashboard",
      },
      {
        source: "/admin/dashboard",
        destination: "/Admin/dashboard",
      },
      {
        source: "/admin/reviews",
        destination: "/Admin/Reviews",
      },
      {
        source: "/admin/reviews/:path*",
        destination: "/Admin/Reviews/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "/Admin/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
