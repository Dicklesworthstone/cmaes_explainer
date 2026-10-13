import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WalkQualityComparison } from "../app/components/WalkQualityComparison";
import type { G1TraceReceipt } from "../app/lib/frankensimCmaes";

// Synthetic receipts isolate presentation arithmetic, not owner/runtime proof.
function receipt(overrides: Partial<G1TraceReceipt> = {}): G1TraceReceipt {
  return {
    objective: 0, distanceMeters: 0.975, completedSteps: 720,
    speedErrorIntegral: 0, actuatorWorkJoules: 0, slipIntegral: 0,
    postureIntegral: 0, jointLimitIntegral: 0, impactIntegral: 0,
    backwardDistanceMeters: 0, lateralErrorIntegral: 0, headingErrorIntegral: 0,
    contactScheduleMismatchIntegral: 0, swingClearanceErrorIntegral: 0,
    singleSupportSeconds: 0, doubleSupportSeconds: 0, flightSeconds: 0,
    pushImpulseNewtonSeconds: 0, recoveryTimeSeconds: 0,
    minimumBaseHeightMeters: 0.6, maximumTiltSine: 0,
    maximumAbsoluteTerrainHeightMeters: 0, maximumBodyPenetrationMeters: 0,
    terminationReason: "horizon", samples: [], ...overrides,
  };
}

async function comparison(baseline: G1TraceReceipt, candidate: G1TraceReceipt) {
  const html = renderToStaticMarkup(createElement(WalkQualityComparison, {
    curriculum: baseline, candidate,
  }));
  const rows: Array<Array<{ text: string; classes: string }>> = [];
  let row: (typeof rows)[number] | null = null;
  let cell: (typeof rows)[number][number] | null = null;
  await new HTMLRewriter().on("div.grid", {
    element(element) {
      row = [];
      rows.push(row);
      element.onEndTag(() => { row = null; });
    },
  }).on("div.grid span", {
    element(element) {
      if (!row) return;
      cell = { text: "", classes: element.getAttribute("class") ?? "" };
      row.push(cell);
      element.onEndTag(() => { cell = null; });
    },
    text(chunk) { if (cell) cell.text += chunk.text; },
  }).transform(new Response(html)).text();
  return {
    html,
    row(label: string) {
      const found = rows.find(cells => cells[0]?.text === label);
      expect(found).toBeDefined();
      return found!;
    },
  };
}

test("a lower objective is green and agrees with the overall verdict", async () => {
  const view = await comparison(receipt({ slipIntegral: 10 }), receipt({ slipIntegral: 5 }));
  const delta = view.row("Multi-factor objective ↓").at(-1)!;
  expect(delta.text).toBe("▲ 66.7%");
  expect(delta.classes).toContain("text-emerald-300");
  expect(view.html).toContain("1 better");
  expect(view.html).toContain("0 worse");
});

test("a higher objective is red and agrees with the overall verdict", async () => {
  const view = await comparison(receipt({ slipIntegral: 5 }), receipt({ slipIntegral: 10 }));
  const delta = view.row("Multi-factor objective ↓").at(-1)!;
  expect(delta.text).toBe("▼ 200.0%");
  expect(delta.classes).toContain("text-rose-300");
  expect(view.html).toContain("0 better");
  expect(view.html).toContain("1 worse");
});

test("improvement keeps its direction for negative objective and displacement baselines", async () => {
  const lower = await comparison(receipt({ slipIntegral: 1 }), receipt());
  expect(lower.row("Multi-factor objective ↓").at(-1)!.text).toBe("▲ 66.7%");
  expect(lower.row("Multi-factor objective ↓").at(-1)!.classes).toContain("text-emerald-300");
  expect(lower.html).toContain("1 better");
  const forward = await comparison(receipt({ distanceMeters: -0.3 }), receipt({ distanceMeters: -0.15 }));
  expect(forward.row("Forward displacement").at(-1)!.text).toBe("▲ 50.0%");
  expect(forward.row("Forward displacement").at(-1)!.classes).toContain("text-emerald-300");
});

test("flat and zero-baseline comparisons never invent a percent", async () => {
  const flat = await comparison(receipt(), receipt());
  expect(flat.row("Multi-factor objective ↓").at(-1)!.text).toBe("≈ 0.0%");
  expect(flat.html).toContain("5 flat");
  const zero = await comparison(receipt({ distanceMeters: 0 }), receipt());
  expect(zero.row("Forward displacement").at(-1)!.text).toBe("— —");
  expect(zero.row("Forward displacement").at(-1)!.classes).toContain("text-slate-500");
});

test("all eleven channel rows show baseline, candidate and candidate-minus-baseline", async () => {
  const view = await comparison(receipt({ slipIntegral: 10, actuatorWorkJoules: 0.975 }),
    receipt({ slipIntegral: 5, actuatorWorkJoules: 1.95 }));
  expect(view.row("slip integral").map(cell => cell.text)).toEqual(["slip integral", "10.0", "5.000", "-5.00"]);
  for (const label of ["mean fwd speed ≥ target", "survival (steps/horizon)", "slip integral",
    "posture integral", "joint-limit integral", "impact integral", "contact-schedule mismatch",
    "lateral error ∫", "heading error ∫", "speed error ∫", "work per meter (efficiency)"]) {
    expect(view.row(label)).toHaveLength(4);
  }
  expect(view.row("work per meter (efficiency)").map(cell => cell.text))
    .toEqual(["work per meter (efficiency)", "1.000", "2.000", "+1.00"]);
});
