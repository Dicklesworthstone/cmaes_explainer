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
      className={`fixed bottom-8 right-8 z-50 inline-flex items-center gap-2 rounded-full bg-sky-500/90 backdrop-blur-md px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-500 hover:bg-sky-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
      <span>Top</span>
    </button>
  );
}
