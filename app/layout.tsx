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
        {props.children}
      </body>
    </html>
  );
}
