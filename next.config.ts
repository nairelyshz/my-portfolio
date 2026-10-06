import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emite /en/index.html para que /en/ funcione en Vercel y en cualquier host estático.
  trailingSlash: true,
  // Export estático: los WebP ya vienen optimizados (SPEC §10).
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    // Con dos root layouts (D1) no hay un layout único para componer el 404.
    globalNotFound: true,
  },
};

export default nextConfig;
