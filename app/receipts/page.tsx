/**
 * app/receipts/page.tsx
 *
 * Presents the committed planning rubric, budget targets and any archived
 * benchmark envelope. Markdown scores are editorial data, not live proof.
 * Runtime measurements belong to their owner/version/configuration scope.
 */

import type { Metadata } from "next";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { HonestyChipStack } from "../components/HonestyChipStack";
import { MaterialDatabaseInspector } from "../components/MaterialDatabaseInspector";
import { FurnitureCatalogInspector } from "../components/FurnitureCatalogInspector";

export const metadata: Metadata = {
  title: "Physics receipts — phr-env-2026",
  description:
    "Single human-readable evidence layer for the phr-env-2026 photo-real + dynamic-physics charter: parity, budget, receipt, SOTA-rubric scores, and per-epic performance budgets.",
};

interface ScoreRow {
  component: string;
  parity: number;
  oracle: number;
  citedBenchmark: number;
  behavioralReceipt: number;
  citations: string;
}

interface BudgetRow {
  epic: string;
  ownerSideP95Ms: number | null;
  explorerSideP95Ms: number | null;
  reference: string;
}

function parseScores(markdown: string): ScoreRow[] {
  const rows: ScoreRow[] = [];
  const lines = markdown.split("\n");
  let inScores = false;
  for (const line of lines) {
    if (line.startsWith("| Component |")) {
      inScores = true;
      continue;
    }
    if (!inScores) continue;
    if (line.startsWith("|---")) continue;
    if (!line.startsWith("|")) {
      inScores = false;
      continue;
    }
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
    if (cells.length < 6) continue;
    const parseScore = (raw: string): number => {
      const match = raw.match(/^(\d+)/);
      return match ? Number(match[1]) : 0;
    };
    rows.push({
      component: cells[0],
      parity: parseScore(cells[1]),
      oracle: parseScore(cells[2]),
      citedBenchmark: parseScore(cells[3]),
      behavioralReceipt: parseScore(cells[4]),
      citations: cells[5],
    });
  }
  return rows;
}

function parseBudgets(markdown: string): BudgetRow[] {
  const rows: BudgetRow[] = [];
  const lines = markdown.split("\n");
  let inBudgets = false;
  for (const line of lines) {
    if (line.startsWith("| Epic |")) {
      inBudgets = true;
      continue;
    }
    if (!inBudgets) continue;
    if (line.startsWith("|---")) continue;
    if (!line.startsWith("|")) {
      inBudgets = false;
      continue;
    }
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
    if (cells.length < 4) continue;
    const parseSide = (raw: string): number | null => {
      const trimmed = raw.trim();
      if (trimmed === "" || trimmed.startsWith("n/a") || trimmed.startsWith("0 ms")) return null;
      const value = parseFloat(trimmed.split(" ")[0]);
      return Number.isFinite(value) ? value : null;
    };
    rows.push({
      epic: cells[0],
      ownerSideP95Ms: parseSide(cells[1]),
      explorerSideP95Ms: parseSide(cells[2]),
      reference: cells[3],
    });
  }
  return rows;
}

const SCORES_PATH = resolve(process.cwd(), "scripts/perf/sota-rubric-scores.md");
const BUDGETS_PATH = resolve(process.cwd(), "scripts/perf/phr-env-2026-budgets.md");
const TEMPLATE_PATH = resolve(process.cwd(), "scripts/perf/sota-rubric.template.md");
const ENVELOPE_PATH = resolve(process.cwd(), "tests/perf/physicsBench.lock.json");

function readOptional(path: string): string | null {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf-8");
}

function scoreColor(score: number): string {
  if (score >= 3) return "text-emerald-300";
  if (score >= 2) return "text-cyan-300";
  if (score >= 1) return "text-amber-300";
  return "text-rose-400";
}

function scoreBg(score: number): string {
  if (score >= 3) return "bg-emerald-400/10 border-emerald-300/20";
  if (score >= 2) return "bg-cyan-400/10 border-cyan-300/20";
  if (score >= 1) return "bg-amber-400/10 border-amber-300/20";
  return "bg-rose-400/10 border-rose-300/20";
}

export default function ReceiptsPage() {
  const scoresMd = readOptional(SCORES_PATH);
  const budgetsMd = readOptional(BUDGETS_PATH);
  const templateMd = readOptional(TEMPLATE_PATH);
  const envelopeMd = readOptional(ENVELOPE_PATH);
  const scores = scoresMd ? parseScores(scoresMd) : [];
  const budgets = budgetsMd ? parseBudgets(budgetsMd) : [];
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            phr-env-2026
          </p>
          <h1 className="text-3xl font-bold text-white">Physics receipts</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-400">
            Explore implementation references, performance targets and archived benchmark data.
            The rubric scores are manually maintained assessments. They do not certify a
            current owner run, and synthetic test inputs do not count as measured robot behavior.
            For a live measurement, run the humanoid or arm experiment and inspect its receipt.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span
              className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-amber-200"
            >
              Planning assessments · not live verification
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-300">
              Slice C (cmaes-phr3m-meas)
            </span>
          </div>
        </header>

        <section className="space-y-4 min-w-0">
          <h2 className="text-xl font-semibold text-white">SOTA-rubric scores</h2>
          <p className="text-xs leading-5 text-slate-400">
            Editorial scores from the committed rubric. On a narrow screen, focus the table
            and scroll horizontally to read every field.
          </p>
          {scores.length === 0 ? (
            <p className="text-sm text-slate-400">No scores yet. The template lives at scripts/perf/sota-rubric.template.md.</p>
          ) : (
            <div role="region" aria-label="Rubric scores, horizontally scrollable" tabIndex={0} className="overflow-x-auto max-w-full rounded-2xl border border-white/10 bg-slate-900/40 min-w-0 focus-visible:outline-2 focus-visible:outline-cyan-300">
              <table className="w-full min-w-[850px] text-left text-sm">
                <caption className="sr-only">Manually maintained rubric scores; not runtime certification</caption>
                <thead className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Component</th>
                    <th className="px-4 py-3 text-center">Parity</th>
                    <th className="px-4 py-3 text-center">Oracle</th>
                    <th className="px-4 py-3 text-center">Cited benchmark</th>
                    <th className="px-4 py-3 text-center">Behavioral receipt</th>
                    <th className="px-4 py-3">Citations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scores.map((row, index) => (
                    <tr key={index} className="text-slate-200">
                      <td className="px-4 py-3 font-mono text-xs min-w-48">{row.component}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scoreBg(row.parity)} ${scoreColor(row.parity)}`}>
                          {row.parity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scoreBg(row.oracle)} ${scoreColor(row.oracle)}`}>
                          {row.oracle}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scoreBg(row.citedBenchmark)} ${scoreColor(row.citedBenchmark)}`}>
                          {row.citedBenchmark}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scoreBg(row.behavioralReceipt)} ${scoreColor(row.behavioralReceipt)}`}>
                          {row.behavioralReceipt}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs leading-5 text-slate-400 min-w-64">{row.citations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-slate-500">
            A score alone establishes neither parity nor successful behavior. Check the
            referenced source and the original run conditions before comparing results.{" "}
            {templateMd && (
              <span className="text-slate-600">
                Template: scripts/perf/sota-rubric.template.md ({templateMd.length.toLocaleString()} bytes)
              </span>
            )}
          </p>
        </section>

        {/* Budgets section. */}
        <section className="space-y-4 min-w-0">
          <h2 className="text-xl font-semibold text-white">Per-epic performance targets</h2>
          <p className="text-xs leading-5 text-slate-400">
            These p95 values are budget targets, not measurements of this device. Scroll the
            table horizontally on narrow screens.
          </p>
          {budgets.length === 0 ? (
            <p className="text-sm text-slate-400">No budgets yet. The doc lives at scripts/perf/phr-env-2026-budgets.md.</p>
          ) : (
            <div role="region" aria-label="Performance targets, horizontally scrollable" tabIndex={0} className="overflow-x-auto max-w-full rounded-2xl border border-white/10 bg-slate-900/40 min-w-0 focus-visible:outline-2 focus-visible:outline-cyan-300">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Performance budget targets; not measured timings</caption>
                <thead className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Epic</th>
                    <th className="px-4 py-3 text-center">Owner-side p95</th>
                    <th className="px-4 py-3 text-center">Explorer-side p95</th>
                    <th className="px-4 py-3">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {budgets.map((row, index) => (
                    <tr key={index} className="text-slate-200">
                      <td className="px-4 py-3 font-mono text-xs min-w-48">{row.epic}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs break-all">
                        {row.ownerSideP95Ms === null ? "n/a" : `${row.ownerSideP95Ms.toFixed(1)} ms`}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs break-all">
                        {row.explorerSideP95Ms === null ? "n/a" : `${row.explorerSideP95Ms.toFixed(1)} ms`}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{row.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-slate-500">
            A performance claim needs recorded workload, device, owner artifact and timing
            samples. A target or an empty benchmark run cannot establish that claim.
          </p>
        </section>

        {/* Bench envelope section. */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Archived benchmark envelopes</h2>
          {envelopeMd ? (
            <pre tabIndex={0} aria-label="Archived benchmark data" className="overflow-x-auto max-w-full rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-xs text-slate-200">
              {envelopeMd}
            </pre>
          ) : (
            <p className="text-sm text-slate-400">
              No envelope file yet. Run{" "}
              <code className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-xs">bun ./tests/perf/physicsBench.ts g1-5040d-terrain-and-push 16</code>{" "}
              to capture the first baseline; the result is written to{" "}
              <code className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-xs">tests/perf/physicsBench.lock.json</code>.
            </p>
          )}
        </section>

        {/* Interactive Honesty Chip Stack & Mathematical Provenance */}
        <section className="space-y-4 pt-4">
          <HonestyChipStack />
        </section>

        {/* PBR Material Database & Contact Friction Inspector */}
        <section className="space-y-4 pt-4">
          <MaterialDatabaseInspector />
        </section>

        {/* 70+ Craftsman Furniture Catalog & Articulation Inspector */}
        <section className="space-y-4 pt-4">
          <FurnitureCatalogInspector />
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs text-slate-500">
          <p>
            This page indexes committed material. Source links and passing metadata tests do
            not substitute for real owner execution, mathematical validation or a reproducible
            performance comparison.
          </p>
        </footer>
      </div>
    </main>
  );
}
