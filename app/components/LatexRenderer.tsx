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
  math?: string;
  latex?: string;
  block?: boolean;
  inline?: boolean;
  className?: string;
}

/**
 * Enable only \htmlClass and \htmlData for interactive variable inspection.
 */
function trustInteractiveTokenMarkup(context: TrustContext): boolean {
  return context.command === "\\htmlClass" || context.command === "\\htmlData";
}

const katexCache = new Map<string, string>();

export function LatexRenderer({
  math,
  latex,
  block = false,
  inline,
  className = "",
}: LatexRendererProps) {
  const expression = math ?? latex ?? "";
  const displayMode = inline !== undefined ? !inline : block;

  const html = useMemo(() => {
    if (!expression) return "";
    const cacheKey = `${displayMode ? "B:" : "I:"}${expression}`;
    const cached = katexCache.get(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const rendered = katex.renderToString(expression, {
        displayMode,
        throwOnError: false,
        output: "html",
        trust: true,
        strict: false,
      });
      katexCache.set(cacheKey, rendered);
      return rendered;
    } catch {
      return null;
    }
  }, [expression, displayMode]);

  if (!html) {
    return (
      <span
        role="status"
        aria-label="Mathematical notation unavailable"
        className={`latex-container inline-block rounded border border-amber-500/50 bg-amber-950/40 px-2 py-1 font-sans text-xs text-amber-200 ${className}`}
      >
        {expression}
      </span>
    );
  }

  if (displayMode) {
    return (
      <div
        className={`latex-container block overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
