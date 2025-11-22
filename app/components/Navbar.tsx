"use client";

import Link from "next/link";
import { Github, Brain, Rocket, Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { AnimatePresence, motion } from "framer-motion";

const sections = [
  { id: "what-is-cmaes", label: "Basics" },
  { id: "no-gradients", label: "Examples" },
  { id: "wing-walkthrough", label: "Wings" },
  { id: "engines", label: "Engines" },
  { id: "live-demo", label: "Demo" },
  { id: "technical-addendum", label: "Math" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeId = useScrollSpy(sections.map((s) => s.id));

  // Handle scroll background for desktop
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* --- Desktop Header --- */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 hidden lg:block ${
          scrolled
            ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent border-b border-transparent py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-inner group-hover:shadow-glow-sm transition-all duration-300 group-hover:scale-105">
              <Brain className="h-5 w-5 text-sky-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-100 font-display group-hover:text-white transition-colors">
                CMA-ES Explainer
              </span>
              <span className="text-[0.65rem] text-slate-400 font-medium tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                Interactive Guide
              </span>
            </div>
          </Link>

          {/* Desktop Nav Pills */}
          <div className="flex items-center gap-1 rounded-full bg-white/5 p-1.5 border border-white/5 backdrop-blur-md shadow-inner-light">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeId === s.id 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Dicklesworthstone/cmaes_explainer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden xl:inline">Source</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-glow-sm transition-all hover:bg-sky-400 hover:scale-105"
            >
              <Rocket className="h-3 w-3" />
              <span>Run Demo</span>
            </a>
          </div>
        </nav>
      </header>

      {/* --- Mobile Top Bar (Logo only) --- */}
      <div className="fixed top-0 inset-x-0 z-40 flex lg:hidden items-center justify-between px-6 py-4 bg-[#020617]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500/20 border border-white/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-sky-300" />
          </div>
          <span className="text-sm font-bold text-white font-display">CMA-ES</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* --- Mobile Floating Dock (Bottom) --- */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex lg:hidden justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl shadow-black/50 max-w-[90%] overflow-x-auto no-scrollbar">
           {sections.slice(0, 4).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeId === s.id 
                    ? "bg-sky-500 text-white shadow-glow-sm" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.label}
              </a>
           ))}
           <div className="w-[1px] h-4 bg-white/10 mx-1" />
           <button 
             onClick={() => setMobileMenuOpen(true)}
             className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
           >
             <Menu className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* --- Mobile Full Screen Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#020617] lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
               <span className="text-lg font-bold font-display text-white">Menu</span>
               <button 
                 onClick={() => setMobileMenuOpen(false)}
                 className="p-2 rounded-full bg-white/5 text-slate-300"
               >
                 <X className="h-6 w-6" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {sections.map((s, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 active:bg-white/10 transition-colors"
                >
                  <span className="font-medium text-slate-200">{s.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </motion.a>
              ))}
              
              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-sky-900/20 to-indigo-900/20 border border-sky-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="h-5 w-5 text-sky-400" />
                  <span className="font-bold text-white">Run the Demo</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Launch the WebAssembly-powered CMA-ES engine directly in your mobile browser.
                </p>
                <a 
                  href="#live-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 rounded-xl bg-sky-500 text-center text-sm font-bold text-white shadow-glow-sm"
                >
                  Launch
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
