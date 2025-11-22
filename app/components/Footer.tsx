"use client";

import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl px-4 pb-6 pt-6 border-t border-slate-800/70">
      <div className="flex flex-col justify-between gap-3 text-[0.7rem] text-slate-500 sm:flex-row">
        <div>
          <span className="font-semibold text-slate-300">CMA-ES Explainer</span> · a living document
          about derivative-free optimization and why it is fun when it shouldn’t be.
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Dicklesworthstone/cmaes_explainer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-300"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Open source on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
