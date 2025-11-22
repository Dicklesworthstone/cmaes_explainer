"use client";

import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-32 max-w-7xl px-6 pb-12 pt-8 border-t border-white/5">
      <div className="flex flex-col justify-between items-start sm:items-center gap-4 text-xs text-slate-500 sm:flex-row">
        <div className="max-w-lg leading-relaxed">
          <strong className="text-slate-400">CMA-ES Explainer</strong> — A living document about derivative-free optimization. 
          Making the &quot;black box&quot; transparent and fun.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Dicklesworthstone/cmaes_explainer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Open Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
