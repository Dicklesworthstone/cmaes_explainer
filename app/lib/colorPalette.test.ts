import { describe, expect, test } from "bun:test";

import {
  COLOR_STYLES,
  prepareInteractiveLatex,
  wrapInteractiveLatexTerm,
} from "./colorPalette";
import type { ColorizedEquation } from "../types/equation";

describe("color palette: interactive LaTeX helpers", () => {
  test("COLOR_STYLES has an entry for every declared ColorVariant", () => {
    // The variant union is the source of truth; this is a smoke test that
    // every variant gets a non-empty style object.
    for (const variant of [
      "crimson",
      "sapphire",
      "emerald",
      "amber",
      "amethyst",
      "cyan",
      "coral",
      "rose",
      "teal",
    ] as const) {
      const cfg = COLOR_STYLES[variant];
      expect(cfg.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(cfg.name.length).toBeGreaterThan(0);
      expect(cfg.badgeLabel.length).toBeGreaterThan(0);
    }
  });

  test("wrapInteractiveLatexTerm produces the expected KaTeX+htmlData+htmlClass structure", () => {
    const out = wrapInteractiveLatexTerm("xi", "x_i", "sapphire");
    // The structure is:
    //   \htmlData{var=<id>}{\htmlClass{<classes>}{\textcolor{<hex>}{<symbol>}}}}
    expect(out).toBe(
      `\\htmlData{var=xi}{\\htmlClass{eq-term eq-term-sapphire eq-term-xi}{\\textcolor{#60a5fa}{x_i}}}`,
    );
  });

  test("wrapInteractiveLatexTerm pins each ColorVariant to its declared hex", () => {
    // Locks in the colour mapping so a refactor that drops a hex
    // immediately breaks the test.
    const expectations: Array<[string, string]> = [
      ["crimson", "#f87171"],
      ["sapphire", "#60a5fa"],
      ["emerald", "#34d399"],
      ["amber", "#fbbf24"],
      ["amethyst", "#c084fc"],
      ["cyan", "#22d3ee"],
      ["coral", "#fb923c"],
      ["rose", "#fb7185"],
      ["teal", "#2dd4bf"],
    ];
    for (const [variant, hex] of expectations) {
      const out = wrapInteractiveLatexTerm("k", "K", variant as keyof typeof COLOR_STYLES);
      expect(out).toContain(`\\textcolor{${hex}}{K}`);
    }
  });

  test("wrapInteractiveLatexTerm is pure (same inputs -> same output)", () => {
    const a = wrapInteractiveLatexTerm("sigma", "\\sigma^{(g)}", "amber");
    const b = wrapInteractiveLatexTerm("sigma", "\\sigma^{(g)}", "amber");
    expect(b).toBe(a);
  });

  test("wrapInteractiveLatexTerm full output is identical across all variants (modulo class and hex)", () => {
    // The wrapping format is fixed: \htmlData{var=<id>}{\htmlClass{...}}{\textcolor{<hex>}{<symbol>}}}.
    // Every variant must produce the same shape with only the variant's
    // class token and hex swapped in. This is the byte-exact contract the
    // MathJax hydration layer depends on: any future change to the wrapping
    // or to a single variant's hex is caught at the variant that moved.
    const allVariants: Array<[string, string]> = [
      ["crimson", "#f87171"],
      ["sapphire", "#60a5fa"],
      ["emerald", "#34d399"],
      ["amber", "#fbbf24"],
      ["amethyst", "#c084fc"],
      ["cyan", "#22d3ee"],
      ["coral", "#fb923c"],
      ["rose", "#fb7185"],
      ["teal", "#2dd4bf"],
    ];
    for (const [variant, hex] of allVariants) {
      const out = wrapInteractiveLatexTerm("k", "K", variant as keyof typeof COLOR_STYLES);
      expect(out).toBe(
        `\\htmlData{var=k}{\\htmlClass{eq-term eq-term-${variant} eq-term-k}{\\textcolor{${hex}}{K}}}`,
      );
    }
  });

  test("prepareInteractiveLatex prefers the prebuilt colorizedLatex when present", () => {
    const equation: ColorizedEquation = {
      id: "test-equation",
      title: "Test",
      category: "test",
      rawLatex: "x = y",
      colorizedLatex: "\\textcolor{#60a5fa}{x} = \\textcolor{#fbbf24}{y}",
      plainEnglishSentence: [],
      variables: [],
      pedagogicalNote: "",
      takeaway: "",
    };
    expect(prepareInteractiveLatex(equation)).toBe(
      "\\textcolor{#60a5fa}{x} = \\textcolor{#fbbf24}{y}",
    );
  });

  test("prepareInteractiveLatex falls back to rawLatex when no colorizedLatex is provided", () => {
    const equation: ColorizedEquation = {
      id: "test-equation-raw",
      title: "Raw only",
      category: "test",
      rawLatex: "x = y",
      colorizedLatex: "",
      plainEnglishSentence: [],
      variables: [],
      pedagogicalNote: "",
      takeaway: "",
    };
    expect(prepareInteractiveLatex(equation)).toBe("x = y");
  });
});
