"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";

// MathJaxContext is a client component that only touches window/document inside
// guarded loaders, so it SSRs fine: the server emits the raw TeX (great for
// crawlers) and typesetting happens client-side after hydration. Do NOT wrap
// this in next/dynamic with ssr:false — that would suppress server rendering
// of the entire children tree (the essay content) and reduce the site to an
// empty shell for crawlers and first paint.
//
// `startup.typeset: false` is load-bearing: MathJax's tex-svg.js otherwise
// auto-typesets the ENTIRE document the moment its script loads. That load
// races React hydration — the sweep mutates raw-TeX text nodes in subtrees
// React has not hydrated yet, React throws #418 and regenerates the whole
// tree, and the page visibly resets (lost scroll position, replayed
// animations) — reproducible ~7/8 loads when the user wheels during load.
const config = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ],
    packages: { "[+]": ["base", "ams"] }
  },
  svg: {
    fontCache: "global"
  },
  startup: {
    typeset: false
  }
};

export function MathProvider(props: { children: ReactNode }) {
  // With startup.typeset disabled, MathJax never sweeps on its own. Run one
  // document-wide typeset from an effect — effects fire strictly after the
  // whole tree has hydrated, so this can never re-trigger the #418 race.
  // Poll until the async MathJax script has actually registered itself.
  useEffect(() => {
    let cancelled = false;
    const w = window as unknown as {
      MathJax?: { typesetPromise?: () => Promise<unknown> };
    };
    const attempt = (n: number) => {
      if (cancelled) return;
      const typeset = w.MathJax?.typesetPromise;
      if (typeset) {
        typeset.call(w.MathJax).catch(() => {});
      } else if (n < 100) {
        setTimeout(() => attempt(n + 1), 100);
      }
    };
    attempt(0);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MathJaxContext version={3} config={config}>
      {props.children}
    </MathJaxContext>
  );
}
