import type { NextConfig } from "next";

const isVercelPreview = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async headers() {
    const headers = [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
    if (isVercelPreview) {
      headers.push({
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      });
    }
    return headers;
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.abdullahbuilt.top" }],
        destination: "https://abdullahbuilt.top/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
