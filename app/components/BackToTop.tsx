"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 480);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-sky-500 text-slate-950 px-3 py-2 text-sm font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300"
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" /> Top
    </button>
  );
}
