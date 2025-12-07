// @ts-check
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    // Removed alias to lib/three-patched.ts to avoid circular dependency.
    // Patching is handled by app/three-patch.ts imported in layout/page.
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {}
  }
};

export default nextConfig;