"use client";

import type { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";

// MathJaxContext is a client component that only touches window/document inside
// guarded loaders, so it SSRs fine: the server emits the raw TeX (great for
// crawlers) and typesetting happens client-side after hydration. Do NOT wrap
// this in next/dynamic with ssr:false — that would suppress server rendering
// of the entire children tree (the essay content) and reduce the site to an
// empty shell for crawlers and first paint.
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
  }
};

export function MathProvider(props: { children: ReactNode }) {
  return (
    <MathJaxContext version={3} config={config}>
      {props.children}
    </MathJaxContext>
  );
}
