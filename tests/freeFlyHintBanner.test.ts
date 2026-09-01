// Regression test for the FreeFlyHintBanner — the keybinding discoverability
// overlay that appears when the user enters the Free-Fly camera mode.
//
// The user had no way to discover the W/A/S/D + Q/E + RMB drag controls
// without reading the source code. The banner makes them discoverable.
// This test asserts the banner is present in the right places and has
// the right structure.

import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import React from "react";
import { FreeFlyHintBanner } from "../app/components/FreeFlyHintBanner";

describe("FreeFlyHintBanner — Free-Fly keybinding discoverability", () => {
  test("renders nothing when visible is false", () => {
    const tree = renderToString(
      React.createElement(FreeFlyHintBanner, { visible: false }),
    );
    expect(tree).toBe("");
  });

  test("renders the keybinding text when visible is true", () => {
    const tree = renderToString(
      React.createElement(FreeFlyHintBanner, { visible: true }),
    );
    expect(tree).not.toBe("");
    // Each keybinding chip should be present
    expect(tree).toContain("W");
    expect(tree).toContain("A");
    expect(tree).toContain("S");
    expect(tree).toContain("D");
    expect(tree).toContain("Q");
    expect(tree).toContain("E");
    // "RMB" or "RMB drag" wording
    expect(tree.toLowerCase()).toMatch(/rmb/);
  });

  test("uses the right semantic role so screen readers announce the keybindings", () => {
    const tree = renderToString(
      React.createElement(FreeFlyHintBanner, { visible: true }),
    );
    expect(tree).toContain('role="status"');
    expect(tree).toContain('aria-live="polite"');
  });

  test("has a dismiss button (keyboard / pointer accessibility)", () => {
    const tree = renderToString(
      React.createElement(FreeFlyHintBanner, { visible: true }),
    );
    // Look for the dismiss button — its aria-label is the contract.
    expect(tree.toLowerCase()).toMatch(/dismiss/);
  });
});
