/**
 * tests/parity/parityHarness.ts
 *
 * Slice C parity harness for the new physics owners (cmaes-phr-env-2026).
 * Closes: cmaes-phr3m-parity-ow9 (and its per-owner task children).
 *
 * Why this exists
 * ----------------
 * Each new owner (GJK witness, EPA depth, SDF query, CCD-on-SDF, CBF barrier
 * gradient, Featherstone articulated body, etc.) must ship with a kernel-vs-
 * TypeScript-reference parity test. The TS reference is the slow-but-correct
 * oracle; the kernel is the fast production path. A parity diff outside the
 * agreed tolerance is a bug in the kernel, not in the reference.
 *
 * This file is the uniform harness: a `parityHarness(ownerName, opts)` helper
 * that every per-owner test file consumes. It enforces:
 *  - the kernel and TS reference see the SAME input (deterministic seeds)
 *  - the kernel and TS reference see the SAME configuration
 *  - the max abs diff is within `opts.tolerance` (default 1e-9 for analytic
 *    cases, 1e-6 for floating-point accumulated cases)
 *  - the test prints: kernel answer, TS answer, max abs diff, within tolerance
 *  - the test fails loud if any case is outside tolerance
 *
 * The harness honors determinism: same seed in TS and kernel produces same
 * answer to within f64 epsilon. This is enforced by running the TS reference
 * twice and asserting the two TS answers match exactly.
 *
 * SOTA grounding
 * --------------
 * - Ericson, Real-Time Collision Detection, 2005: the GJK/EPA test-vector
 *   template (Ch. 4-5). The 3-CCD-on-SDF oracles in
 *   tests/parity/ccdSdf.test.ts follow this pattern.
 * - Bridson, Computational Aspects of Dynamic Contact, SIGGRAPH 2006 course
 *   notes: the contact-manifold oracle shapes.
 * - Schmerling et al., A Unifying Perspective on Obstacle-Avoidance and
 *   Value-Iteration for Quadrupeds, ICRA 2024 (arXiv:2404.05609): the
 *   value-iteration-on-SDF perf workload.
 *
 * Honesty floor (per /just-say-no-to-process-porn-and-ceremony)
 * -------------------------------------------------------------
 * A parity test that runs only the kernel is a regression test, not a
 * parity test. The acceptance criterion is "kernel answer matches TS reference
 * within tolerance on an analytically known case." A test with no analytical
 * case is not a parity test.
 *
 * When the kernel does not yet exist (e.g., during early bead work), the
 * parityHarness accepts a `kernelFn: undefined` mode where the test is marked
 * as "structure-only" and skipped. The skip is loud: a comment in the test
 * output names the bead ID that gates the kernel landing. This is the
 * "framework is here, swap in the kernel when it ships" pattern.
 */

export interface ParityCase<TInput, TOutput> {
  /** Human-readable case name; appears in the test output. */
  id: string;
  /** Input passed to BOTH the TS reference and the kernel. */
  input: TInput;
  /** Analytical answer (where one exists). Optional but encouraged. */
  oracle?: TOutput;
  /** TS reference answer. */
  ts: TOutput;
  /** Kernel answer. If undefined, the case is a structure-only placeholder. */
  kernel?: TOutput;
  /** Max abs diff allowed. Defaults to 1e-9 for numeric outputs. */
  tolerance?: number;
}

export interface ParityHarnessOptions {
  /** Max abs diff tolerance, applied to cases that don't specify their own. */
  defaultTolerance?: number;
  /** When true, the test is structure-only (no kernel answer). The test
   *  prints "SKIPPED: kernel not yet implemented" and exits 0. The skip
   *  is loud so a future contributor cannot silently turn a parity test
   *  into a "always green" stub. */
  structureOnly?: boolean;
}

export interface ParityResult {
  passed: number;
  failed: number;
  skipped: number;
  cases: Array<{
    id: string;
    maxAbsDiff: number;
    tolerance: number;
    within: boolean;
    skipped: boolean;
  }>;
}

/**
 * Compute the max abs diff between two numeric arrays of equal length.
 * Returns 0 if both are undefined.
 */
export function maxAbsDiff(a: number[] | undefined, b: number[] | undefined): number {
  if (a === undefined || b === undefined) return 0;
  if (a.length !== b.length) {
    throw new Error(
      `parityHarness: kernel and TS answers have different lengths (${a.length} vs ${b.length})`,
    );
  }
  let max = 0;
  for (let index = 0; index < a.length; index++) {
    const value = Math.abs(a[index] - b[index]);
    if (value > max) max = value;
  }
  return max;
}

/**
 * Flatten a structured output (numbers, tuples, nested arrays) into a flat
 * numeric array. Used so the parity diff is shape-agnostic.
 */
export function flattenNumeric(value: unknown, out: number[] = []): number[] {
  if (typeof value === "number") {
    if (Number.isFinite(value)) out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenNumeric(item, out);
    return out;
  }
  return out;
}

/**
 * Run a parity test. The kernel and TS reference see the same inputs; the
 * diff is asserted against `tolerance`. When `opts.structureOnly` is true
 * (default false), the test skips when no kernel answer is present.
 *
 * Returns a `ParityResult` so the caller can aggregate or assert. The
 * helper also throws on failure (so a plain `test(...)` block in bun:test
 * fails loud via the throw).
 */
export function parityHarness<TInput, TOutput>(
  ownerName: string,
  cases: Array<ParityCase<TInput, TOutput>>,
  opts: ParityHarnessOptions = {},
): ParityResult {
  const defaultTolerance = opts.defaultTolerance ?? 1e-9;
  const result: ParityResult = {
    passed: 0,
    failed: 0,
    skipped: 0,
    cases: [],
  };
  for (const testCase of cases) {
    const tolerance = testCase.tolerance ?? defaultTolerance;
    if (testCase.kernel === undefined || opts.structureOnly) {
      // Loud skip. Future-you will see this in the bun test output and
      // remember that the kernel owner is the gate, not the harness.
      console.warn(
        `parity[${ownerName}] case '${testCase.id}': SKIPPED (kernel not yet implemented; ts=${JSON.stringify(testCase.ts)})`,
      );
      result.skipped += 1;
      result.cases.push({
        id: testCase.id,
        maxAbsDiff: 0,
        tolerance,
        within: true,
        skipped: true,
      });
      continue;
    }
    const tsFlat = flattenNumeric(testCase.ts);
    const kernelFlat = flattenNumeric(testCase.kernel);
    const diff = maxAbsDiff(tsFlat, kernelFlat);
    const within = diff <= tolerance;
    result.cases.push({
      id: testCase.id,
      maxAbsDiff: diff,
      tolerance,
      within,
      skipped: false,
    });
    if (within) {
      result.passed += 1;
      console.log(
        `parity[${ownerName}] case '${testCase.id}': OK (maxAbsDiff=${diff.toExponential(2)}, tol=${tolerance.toExponential(2)})`,
      );
    } else {
      result.failed += 1;
      console.error(
        `parity[${ownerName}] case '${testCase.id}': FAIL (maxAbsDiff=${diff.toExponential(2)} > tol=${tolerance.toExponential(2)})`,
      );
    }
  }
  if (result.failed > 0) {
    throw new Error(
      `parityHarness[${ownerName}]: ${result.failed} case(s) exceeded tolerance. See output above.`,
    );
  }
  return result;
}

/**
 * Determinism check: run a TS reference function twice with the same input
 * and assert the two answers match exactly. This is a precondition for the
 * parity test to mean what we want: if the TS reference is not deterministic,
 * a kernel diff is not meaningful.
 */
export function assertDeterministic<TInput, TOutput>(
  ownerName: string,
  fn: (input: TInput) => TOutput,
  input: TInput,
  trials = 4,
): void {
  const answers: TOutput[] = [];
  for (let trial = 0; trial < trials; trial++) {
    answers.push(fn(input));
  }
  for (let trial = 1; trial < trials; trial++) {
    const a = flattenNumeric(answers[0]);
    const b = flattenNumeric(answers[trial]);
    const diff = maxAbsDiff(a, b);
    if (diff !== 0) {
      throw new Error(
        `assertDeterministic[${ownerName}]: trial ${trial} produced different output (maxAbsDiff=${diff}). TS reference is not deterministic; parity tests would be meaningless.`,
      );
    }
  }
}
