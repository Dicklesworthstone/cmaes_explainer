import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://cmaesexplainer.vercel.app"),
  title: "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer",
  description: "A living, interactive explainer of CMA-ES, with high-performance Rust implementations for browser and Python.",
  openGraph: {
    title: "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer",
    description: "A living, interactive explainer of CMA-ES, with high-performance Rust implementations for browser and Python.",
    url: "https://cmaesexplainer.vercel.app",
    siteName: "CMA-ES Explainer",
    images: [{ url: "/og-image.png", width: 1280, height: 640, alt: "CMA-ES Explainer" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer",
    description: "A living, interactive explainer of CMA-ES, with high-performance Rust implementations for browser and Python.",
    images: ["/og-image.png"]
  }
};

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
