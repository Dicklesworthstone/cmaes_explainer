"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Brain, Rocket, Menu, X, ChevronRight, Keyboard, Command, ShieldCheck } from "lucide-react";
import { useEffect, useState, useRef, useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { AnimatePresence, motion } from "framer-motion";

const sections = [
  { id: "what-is-cmaes", label: "Basics" },
  { id: "no-gradients", label: "Examples" },
  { id: "wing-walkthrough", label: "Wings" },
  { id: "engines", label: "Engines" },
  { id: "live-demo", label: "Demo" },
  { id: "internals", label: "3D Space" },
  { id: "robotics-flagships", label: "Robotics" },
  { id: "hpo", label: "HPO" },
  { id: "technical-addendum", label: "Math" },
];

export function Navbar() {
  const pathname = usePathname();
  const getHref = useCallback((id: string) => (pathname === "/" ? `#${id}` : `/#${id}`), [pathname]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeId = useScrollSpy(sections.map((s) => s.id));

  // The mobile dock scrolls horizontally with a hidden scrollbar, so keep
  // the active section's pill centered — otherwise on a phone the current
  // section can sit off-screen with no hint that the bar scrolls at all.
  // Manual scrollTo (not scrollIntoView) so the page itself never moves.
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock || !activeId) return;
    const pill = dock.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!pill) return;
    const target = pill.offsetLeft - (dock.clientWidth - pill.clientWidth) / 2;
    dock.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  // Handle scroll background & GPU reading progress without React re-renders
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled((prev) => {
            const next = window.scrollY > 20;
            return prev === next ? prev : next;
          });
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0 && progressBarRef.current) {
            const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Global keyboard shortcuts (j/k navigation, d for demo, m for math, t for top, ? for help)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "?" || (e.key === "/" && !e.shiftKey)) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setShortcutsModalOpen(false);
        setMobileMenuOpen(false);
      } else if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        const currentIdx = sections.findIndex((s) => s.id === activeId);
        const nextIdx = Math.min(sections.length - 1, currentIdx + 1);
        const nextEl = document.getElementById(sections[nextIdx].id);
        if (nextEl) nextEl.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        const currentIdx = sections.findIndex((s) => s.id === activeId);
        const prevIdx = Math.max(0, currentIdx - 1);
        const prevEl = document.getElementById(sections[prevIdx].id);
        if (prevEl) prevEl.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        const el = document.getElementById("live-demo");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        const el = document.getElementById("technical-addendum");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [activeId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modals or mobile menu are open
  useEffect(() => {
    if (mobileMenuOpen || shortcutsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }
  }, [mobileMenuOpen, shortcutsModalOpen]);

  // Dialog semantics (WCAG 2.4.3): move focus into the dialog on open and
  // restore it to the trigger on close. Escape and ? keep working through
  // the global keydown handler above; the close button gets initial focus.
  useEffect(() => {
    if (!shortcutsModalOpen) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeBtnRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [shortcutsModalOpen]);

  // True-modal focus containment: aria-modal marks the background inert for
  // assistive tech; Tab/Shift+Tab cycle within the dialog so physical focus
  // cannot escape an open modal. The dialog holds only the close button
  // today; the wrap stays correct as content grows.
  const trapDialogTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const dialog = e.currentTarget;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const active = document.activeElement;
    const inside = active instanceof Node && dialog.contains(active);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (!inside || active === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (!inside || active === last)) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar (GPU Accelerated) */}
      <div className="fixed top-0 inset-x-0 h-1 z-[100] bg-slate-950/40 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* --- Desktop Header --- */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,padding] duration-500 hidden lg:block ${
          scrolled
            ? "bg-[#020617]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl shadow-black/50"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shadow-inner group-hover:shadow-glow-sm transition-[transform,box-shadow] duration-300 group-hover:scale-105">
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
          <div className="flex items-center gap-1 rounded-full bg-slate-950/60 p-1.5 border border-white/10 backdrop-blur-md shadow-inner">
            {sections.map((s) => (
              <a
                key={s.id}
                href={getHref(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                  pathname === "/" && activeId === s.id
                    ? "bg-sky-500 text-white shadow-glow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {s.label}
              </a>
            ))}
            <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
            <Link
              href="/humanoid"
              className={`px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-colors ${
                pathname === "/humanoid"
                  ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40"
                  : "text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/10"
              }`}
            >
              G1
            </Link>
            <Link
              href="/arm"
              className={`px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-colors ${
                pathname === "/arm"
                  ? "bg-orange-500/25 text-orange-200 border border-orange-400/40"
                  : "text-orange-400/80 hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              iiwa
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Keyboard Shortcuts Trigger Button */}
            <button
              onClick={() => setShortcutsModalOpen(true)}
              title="Keyboard shortcuts (Press ?)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/10 hover:border-white/20 transition-[background-color,color,border-color]"
            >
              <Keyboard className="h-3.5 w-3.5" />
              <span className="text-[0.65rem] bg-white/10 px-1 py-0.5 rounded font-mono">?</span>
            </button>

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
              href={getHref("live-demo")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-glow-sm transition-[background-image,transform] hover:scale-105"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Run Demo</span>
            </a>
          </div>
        </nav>
      </header>

      {/* --- Mobile Top Bar (Logo + Menu Toggle) --- */}
      <div className="fixed top-0 inset-x-0 z-40 flex lg:hidden items-center justify-between px-5 py-3.5 bg-[#020617]/90 backdrop-blur-lg border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-500/20 border border-white/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-sky-300" />
          </div>
          <span className="text-sm font-bold text-white font-display">CMA-ES Explainer</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            aria-label="Keyboard Shortcuts"
            onClick={() => setShortcutsModalOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-slate-300"
          >
            <Keyboard className="h-4 w-4" />
          </button>
          <button
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* --- Mobile Floating Dock (Bottom with Smooth Horizontal Scroll) --- */}
      <div className="fixed bottom-5 inset-x-0 z-40 flex lg:hidden justify-center pointer-events-none px-4">
        <div
          ref={dockRef}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-[#030712]/90 backdrop-blur-2xl border border-white/15 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] w-full max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={getHref(s.id)}
              className={`flex min-h-[44px] items-center px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] ${
                pathname === "/" && activeId === s.id
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </a>
          ))}
          <div className="w-[1px] h-4 bg-white/10 mx-0.5 shrink-0" />
          <button
            aria-label="Open full menu"
            onClick={() => setMobileMenuOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 shrink-0"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- Keyboard Shortcuts Modal Overlay --- */}
      <AnimatePresence>
        {shortcutsModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onKeyDown={trapDialogTab}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            {/* Backdrop click dismisses; Escape/? are handled by the global
                keydown handler (focus is moved into the dialog on open, so
                the old backdrop onKeyDown could never fire anyway). */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShortcutsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-950 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Keyboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Keyboard Shortcuts</h3>
                    <p className="text-xs text-slate-400">Navigate the interactive explainer with speed</p>
                  </div>
                </div>
                  <button
                    ref={closeBtnRef}
                    onClick={() => setShortcutsModalOpen(false)}
                    aria-label="Close keyboard shortcuts"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { keys: ["J"], desc: "Jump to next chapter" },
                  { keys: ["K"], desc: "Jump to previous chapter" },
                  { keys: ["D"], desc: "Launch live WebAssembly benchmark demo" },
                  { keys: ["M"], desc: "Jump to Mathematical Addendum" },
                  { keys: ["T"], desc: "Scroll smoothly to top of page" },
                  { keys: ["?"], desc: "Toggle this keyboard shortcuts dialog" },
                  { keys: ["Esc"], desc: "Close open dialog or drawer" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <span className="text-slate-300 font-medium">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-1 rounded bg-slate-900 border border-white/15 font-mono text-[0.7rem] text-sky-300 font-bold shadow-inner"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[0.7rem] text-slate-500">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 font-mono text-slate-400">Esc</kbd> anytime to dismiss.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Brain className="h-5 w-5 text-sky-400" />
                <span className="text-lg font-bold font-display text-white">Table of Contents</span>
              </div>
              <button
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/5 text-slate-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
              {/* Dedicated Flagship Quick Nav */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Link
                  href="/humanoid"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-950/40 p-3.5 text-left"
                >
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-cyan-300 block">
                    Flagship 1
                  </span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    G1 Walking
                  </span>
                  <span className="text-[0.7rem] text-cyan-200/70 block mt-1">
                    5,040-D Whole-Body
                  </span>
                </Link>

                <Link
                  href="/arm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-orange-400/30 bg-orange-950/40 p-3.5 text-left"
                >
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-orange-300 block">
                    Flagship 2
                  </span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    iiwa14 Arm
                  </span>
                  <span className="text-[0.7rem] text-orange-200/70 block mt-1">
                    128-D Household
                  </span>
                </Link>
              </div>

              {sections.map((s, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  key={s.id}
                  href={getHref(s.id)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                    pathname === "/" && activeId === s.id
                      ? "bg-sky-500/15 border-sky-500/40 text-white shadow-glow-sm"
                      : "bg-white/5 border-white/5 text-slate-300 active:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-sky-400 w-5">0{i + 1}</span>
                    <span className="font-semibold text-slate-200">{s.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </motion.a>
              ))}

              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-sky-900/20 via-indigo-900/20 to-purple-900/20 border border-sky-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="h-5 w-5 text-sky-400" />
                  <span className="font-bold text-white font-display">Run the Live WASM Demo</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Execute SIMD WebAssembly optimization kernels with real-time 2D and 3D phase-space visualization directly in your browser.
                </p>
                <a
                  href="#live-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-center text-sm font-bold text-white shadow-glow-sm active:scale-95 transition-transform"
                >
                  Launch Playground
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
