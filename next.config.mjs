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
      {
        // The vendored wasm-demo pages pull scripts from CDNs (tailwind, jsDelivr, Google
        // Fonts) that don't send CORP headers, which `require-corp` blocks. Serve them with
        // `credentialless` instead: CDN loads succeed and Chrome still grants
        // crossOriginIsolated (SharedArrayBuffer) for the pkg-par threaded build.
        source: "/wasm-demo/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
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