"use client";

import Link from "next/link";
import { Github, Brain, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";

const sections = [
  { id: "what-is-cmaes", label: "What is CMA-ES?" },
  { id: "no-gradients", label: "No-gradient examples" },
  { id: "wing-walkthrough", label: "Wing walk-through" },
  { id: "engines", label: "Rust engines" },
  { id: "live-demo", label: "Live demo" },
  { id: "technical-addendum", label: "Technical addendum" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sections.map((s) => s.id));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/60"
          : "bg-gradient-to-b from-slate-950/95 to-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-lg transition-shadow">
            <Brain className="h-4 w-4 text-sky-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              CMA-ES Explainer
            </span>
            <span className="text-xs text-slate-400">
              Black-box optimization I actually enjoy
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-xs md:flex" aria-label="Page sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`transition-colors ${activeId === s.id ? "text-sky-100 font-semibold" : "text-slate-300/80 hover:text-sky-200"}`}
              aria-current={activeId === s.id ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Dicklesworthstone/cmaes_explainer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 hover:border-sky-400/70 hover:text-sky-100 hover:bg-slate-900 shadow-sm"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Source</span>
          </a>
          <span className="hidden items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] text-emerald-200 md:inline-flex">
            <Rocket className="h-3 w-3" />
            <span>Deployable to Vercel in one script</span>
          </span>
        </div>
      </nav>

      <div className="md:hidden border-t border-slate-800/50 bg-slate-950/90 backdrop-blur-lg px-4 pb-3 pt-2">
        <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Section shortcuts">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.85rem] transition-colors ${activeId === s.id ? "border-sky-400/80 bg-sky-500/10 text-sky-50" : "border-slate-800 bg-slate-900/80 text-slate-100 hover:border-sky-400/70 hover:text-sky-100"}`}
              aria-current={activeId === s.id ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
