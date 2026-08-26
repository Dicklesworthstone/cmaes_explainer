import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cmaesexplainer.vercel.app"),
  title: "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer",
  description: "A living, interactive explainer of CMA-ES, with high-performance Rust implementations for browser and Python.",
  authors: [{ name: "Jeffrey Emanuel", url: "https://jeffreyemanuel.com/" }],
  creator: "Jeffrey Emanuel"
};
// NOTE: no explicit openGraph/twitter metadata here — app/opengraph-image.tsx
// and app/twitter-image.tsx are auto-detected by Next.js and emit <meta> tags
// with cache-busting hashes. Defining openGraph.images / twitter.images would
// override (and break) the file-convention endpoints.

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-shell">
        <SmoothScroll>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-slate-900"
          >
            Skip to content
          </a>
          {props.children}
        </SmoothScroll>
      </body>
    </html>
  );
}
