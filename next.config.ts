import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // Global defensive security headers for all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Public images, icons, and metadata files: 1 year immutable cache
        source: "/:path*.(svg|png|jpg|jpeg|webp|ico|txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // All tool pages & static routes: 1 hr browser cache, 24 hr edge cache, 7 day stale-while-revalidate
        source: "/:slug([a-zA-Z0-9_-]+)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
      },
      {
        source: "/page-sitemap.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/bitcoin-address-generator",
        destination: "/",
        permanent: true,
      },
      {
        source: "/bitcoin-address-generator/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/heart-symbols-unicode",
        destination: "/",
        permanent: true,
      },
      {
        source: "/heart-symbols-unicode/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

