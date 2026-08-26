/**
 * app/components/LatexRenderer.tsx
 *
 * Fast KaTeX renderer with security-audited HTML extensions for interactive math tokens.
 */
"use client";

import type { TrustContext } from "katex";
import katex from "katex";
import React, { useMemo } from "react";

interface LatexRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Enable only \htmlClass and \htmlData for interactive variable inspection.
 */
function trustInteractiveTokenMarkup(context: TrustContext): boolean {
  return context.command === "\\htmlClass" || context.command === "\\htmlData";
}

export function LatexRenderer({ math, block = false, className = "" }: LatexRendererProps) {
  const html = useMemo(() => {
    if (!math) return "";
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
        trust: trustInteractiveTokenMarkup,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [math, block]);

  if (!html) {
    return (
      <span
        role="status"
        aria-label="Mathematical notation unavailable"
        className={`latex-container inline-block rounded border border-amber-500/50 bg-amber-950/40 px-2 py-1 font-sans text-xs text-amber-200 ${className}`}
      >
        {math}
      </span>
    );
  }

  return (
    <span
      className={`latex-container inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * TextWithLatex parses mixed text containing $inline$ and $$block$$ math delimiters.
 */
export function TextWithLatex({ text, className = "" }: { text: string; className?: string }) {
  const elements = useMemo(() => {
    if (!text) return null;

    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
    const seen = new Map<string, number>();

    return parts.map((part) => {
      const n = (seen.get(part) ?? 0) + 1;
      seen.set(part, n);
      const key = `${n}:${part.slice(0, 48)}`;

      if (part.startsWith("$$") && part.endsWith("$$")) {
        const formula = part.slice(2, -2);
        return (
          <span key={key} className="block overflow-x-auto my-2">
            <LatexRenderer math={formula} block={true} />
          </span>
        );
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        const formula = part.slice(1, -1);
        return <LatexRenderer key={key} math={formula} block={false} />;
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  }, [text]);

  return <span className={className}>{elements}</span>;
}
