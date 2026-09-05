/**
 * tests/parity/parityHarness.ts
 *
 * Slice C parity harness for the new physics owners (cmaes-phr-env-2026).
 *
 * Why this exists
 * ----------------
 * Each new owner (GJK witness, EPA depth, SDF query, CCD-on-SDF, CBF barrier
 * gradient, Featherstone articulated body, etc.) must ship with a kernel-vs-
 * TypeScript-reference parity test. The TS reference is the slow-but-correct
 * oracle; the kernel is the fast production path. A parity diff outside the
 * agreed tolerance requires investigating both implementations and the oracle.
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
 *
 * Honesty floor (per /just-say-no-to-process-porn-and-ceremony)
 * -------------------------------------------------------------
 * A parity test that runs only the kernel is a regression test, not a
 * parity test. The acceptance criterion is "kernel answer matches TS reference
 * within tolerance on an analytically known case." A test with no analytical
 * case is not a parity test.
 *
 * Missing kernels and empty comparisons fail. This harness compares supplied
 * results; the caller must actually execute the named independent backends.
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
  /** Actual kernel answer. Missing answers fail conformance. */
  kernel?: TOutput;
  /** Max abs diff allowed. Defaults to 1e-9 for numeric outputs. */
  tolerance?: number;
  relativeTolerance?: number;
}

export interface ParityHarnessOptions {
  /** Max abs diff tolerance, applied to cases that don't specify their own. */
  defaultTolerance?: number;
  defaultRelativeTolerance?: number;
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
    comparedScalars: number;
  }>;
}

/**
 * Compute the max abs diff between two numeric arrays of equal length.
 * Missing, empty and nonfinite arrays are invalid comparisons.
 */
export function maxAbsDiff(a: number[] | undefined, b: number[] | undefined): number {
  if (a === undefined || b === undefined || a.length === 0 || b.length === 0) {
    throw new Error("parityHarness: missing or empty numeric answer");
  }
  if (a.length !== b.length) {
    throw new Error(
      `parityHarness: kernel and TS answers have different lengths (${a.length} vs ${b.length})`,
    );
  }
  let max = 0;
  for (let index = 0; index < a.length; index++) {
    if (!Number.isFinite(a[index]) || !Number.isFinite(b[index])) {
      throw new Error(`parityHarness: nonfinite answer at $[${index}]`);
    }
    const value = Math.abs(a[index] - b[index]);
    if (value > max) max = value;
  }
  return max;
}

/**
 * Extract numbers for diagnostics only. Parity itself preserves structure.
 */
export function flattenNumeric(value: unknown, out: number[] = []): number[] {
  compareAnswers(value, value, 0, 0, (a) => out.push(a));
  return out;
}

/** Compare exact shapes and metadata, with tolerances only on finite numbers. */
function compareAnswers(
  actual: unknown,
  expected: unknown,
  absoluteTolerance: number,
  relativeTolerance: number,
  onNumber: (actual: number, expected: number) => void,
  path = "$",
  ancestors = new Set<object>(),
): void {
  const fail = (reason: string): never => {
    throw new Error(`${path}: ${reason}`);
  };
  if (typeof actual === "number" && typeof expected === "number") {
    if (!Number.isFinite(actual) || !Number.isFinite(expected)) fail("nonfinite numeric value");
    const difference = Math.abs(actual - expected);
    const scale = Math.max(Math.abs(actual), Math.abs(expected));
    // Normalize rather than multiplying the scale: finite opposite extremes
    // can overflow both the subtraction and a relative error budget.
    const relativeDifference = scale === 0 ? 0 : Math.abs(actual / scale - expected / scale);
    if (difference > absoluteTolerance && relativeDifference > relativeTolerance) {
      fail(`numeric mismatch: actual=${actual}, expected=${expected}, absolute=${absoluteTolerance}, relative=${relativeTolerance}`);
    }
    onNumber(actual, expected);
    return;
  }
  if (actual === null || expected === null || typeof actual !== "object" || typeof expected !== "object") {
    if (actual === undefined || expected === undefined) fail("missing value");
    if (!["string", "boolean"].includes(typeof actual) && actual !== null) fail("unsupported value");
    if (!Object.is(actual, expected)) fail("type or metadata mismatch");
    return;
  }
  if (ancestors.has(actual) || ancestors.has(expected)) fail("cyclic output");
  ancestors.add(actual);
  ancestors.add(expected);
  try {
    if (ArrayBuffer.isView(actual) || ArrayBuffer.isView(expected)) {
      if (!ArrayBuffer.isView(actual) || !ArrayBuffer.isView(expected) ||
        actual instanceof DataView || expected instanceof DataView ||
        actual.constructor !== expected.constructor) fail("typed-array type mismatch");
      const a = actual as unknown as ArrayLike<number>;
      const b = expected as unknown as ArrayLike<number>;
      if (a.length !== b.length) fail("typed-array length mismatch");
      for (let index = 0; index < a.length; index++) {
        compareAnswers(a[index], b[index], absoluteTolerance, relativeTolerance, onNumber, `${path}[${index}]`, ancestors);
      }
      return;
    }
    if (Array.isArray(actual) !== Array.isArray(expected)) fail("array/object shape mismatch");
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) fail("array length mismatch");
      for (let index = 0; index < actual.length; index++) {
        compareAnswers(actual[index], expected[index], absoluteTolerance, relativeTolerance, onNumber, `${path}[${index}]`, ancestors);
      }
      return;
    }
    for (const value of [actual, expected]) {
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) fail("unsupported object type");
      if (Reflect.ownKeys(value).some((key) => typeof key === "symbol")) fail("symbol field is unsupported");
    }
    const a = actual as Record<string, unknown>;
    const b = expected as Record<string, unknown>;
    const keys = Object.getOwnPropertyNames(a).sort();
    const otherKeys = Object.getOwnPropertyNames(b).sort();
    if (keys.length !== otherKeys.length || keys.some((key, index) => key !== otherKeys[index])) fail("object keys differ");
    for (const key of keys) {
      if (!Object.hasOwn(Object.getOwnPropertyDescriptor(a, key)!, "value") ||
        !Object.hasOwn(Object.getOwnPropertyDescriptor(b, key)!, "value")) fail("accessor output is unsupported");
      compareAnswers(a[key], b[key], absoluteTolerance, relativeTolerance, onNumber, `${path}[${JSON.stringify(key)}]`, ancestors);
    }
  } finally {
    ancestors.delete(actual);
    ancestors.delete(expected);
  }
}

function validateTolerance(value: number): void {
  if (!Number.isFinite(value) || value < 0) throw new Error("parityHarness: tolerance must be finite and nonnegative");
}

/**
 * Run a parity test. The kernel and TS reference see the same inputs; the
 * diff is asserted against absolute/relative tolerances. Missing required
 * answers, zero comparisons, or disagreement with an oracle are failures.
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
  const defaultRelativeTolerance = opts.defaultRelativeTolerance ?? 0;
  validateTolerance(defaultTolerance);
  validateTolerance(defaultRelativeTolerance);
  if (cases.length === 0) throw new Error(`parityHarness[${ownerName}]: no cases`);
  const result: ParityResult = {
    passed: 0,
    failed: 0,
    skipped: 0,
    cases: [],
  };
  for (const testCase of cases) {
    const tolerance = testCase.tolerance ?? defaultTolerance;
    const relativeTolerance = testCase.relativeTolerance ?? defaultRelativeTolerance;
    validateTolerance(tolerance);
    validateTolerance(relativeTolerance);
    let diff = 0;
    let comparedScalars = 0;
    try {
      if (testCase.kernel === undefined) throw new Error("missing required kernel answer");
      compareAnswers(testCase.kernel, testCase.ts, tolerance, relativeTolerance, (a, b) => {
        diff = Math.max(diff, Math.abs(a - b));
        comparedScalars++;
      });
      if (comparedScalars === 0) throw new Error("zero numeric values compared");
      if (Object.hasOwn(testCase, "oracle")) {
        compareAnswers(testCase.ts, testCase.oracle, tolerance, relativeTolerance, () => {});
        compareAnswers(testCase.kernel, testCase.oracle, tolerance, relativeTolerance, () => {});
      }
    } catch (error) {
      throw new Error(`parityHarness[${ownerName}] case '${testCase.id}': ${error instanceof Error ? error.message : String(error)}`);
    }
    result.cases.push({
      id: testCase.id,
      maxAbsDiff: diff,
      tolerance,
      within: true,
      skipped: false,
      comparedScalars,
    });
    result.passed++;
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
  if (!Number.isInteger(trials) || trials < 2) throw new Error("assertDeterministic: at least two trials are required");
  const answers: TOutput[] = [];
  for (let trial = 0; trial < trials; trial++) {
    answers.push(structuredClone(fn(structuredClone(input))));
  }
  for (let trial = 1; trial < trials; trial++) {
    parityHarness(`determinism:${ownerName}:trial-${trial}`, [{
      id: "same-input",
      input,
      ts: answers[0],
      kernel: answers[trial],
      tolerance: 0,
    }]);
  }
}
