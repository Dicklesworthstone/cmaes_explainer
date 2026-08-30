import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../../../app/globals.css";

export const metadata: Metadata = {
  title: "FrankenRobots Engine",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function EngineLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="m-0 min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
