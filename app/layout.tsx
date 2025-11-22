import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer",
  description: "A living, interactive explainer of CMA-ES, with high-performance Rust implementations for browser and Python."
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-shell">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-slate-900"
        >
          Skip to content
        </a>
        {props.children}
      </body>
    </html>
  );
}
