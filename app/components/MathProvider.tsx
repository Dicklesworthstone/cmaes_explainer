"use client";

import type { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";

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
