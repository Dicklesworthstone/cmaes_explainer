import { describe, expect, test } from "bun:test";
import {
  decodePolicyFragment,
  decodeSharedPolicy,
  encodePolicyFragment,
  encodeSharedPolicy,
  policyFileContents,
  policyFragmentFromHash,
  policyFromFileContents,
  policyShareUrl,
  type SharedPolicyMeta,
} from "../app/lib/g1PolicyShare";

const META: SharedPolicyMeta = {
  kernelVersion: "fs-cmaes-viz-wasm 0.6.19",
  task: "walking",
  challenge: "terrain-and-push",
  family: "lm-ma",
  generation: 352,
  sigma: 0.0005,
};

/** A baseline shaped like the real curriculum mean: 5,040 small coefficients. */
function baselineOf(length = 5_040): Float64Array {
  const values = new Float64Array(length);
  for (let index = 0; index < length; index++) {
    values[index] = Math.sin(index * 0.37) * 0.4;
  }
  return values;
}

/** A learned policy: the baseline plus a search-sized perturbation. */
function learnedOf(baseline: Float64Array, amplitude = 0.004): Float64Array {
  const values = new Float64Array(baseline.length);
  for (let index = 0; index < baseline.length; index++) {
    values[index] = baseline[index] + Math.cos(index * 1.13) * amplitude;
  }
  return values;
}

describe("G1 policy share codec", () => {
  test("round-trips a learned policy exactly", () => {
    const baseline = baselineOf();
    const learned = learnedOf(baseline);
    const decoded = decodeSharedPolicy(encodeSharedPolicy(learned, META), learned.length);

    expect(decoded.policy).toHaveLength(learned.length);
    let worst = 0;
    for (let index = 0; index < learned.length; index++) {
      worst = Math.max(worst, Math.abs(decoded.policy[index] - learned[index]));
    }
    // Exact. A lossy link does not reproduce the gait that was trained: a
    // float32 delta made the restored policy fall at 1.40 s instead of 1.50 s.
    expect(worst).toBe(0);
  });

  test("carries the metadata a recipient needs to know what they were sent", () => {
    const baseline = baselineOf(64);
    const decoded = decodeSharedPolicy(
      encodeSharedPolicy(learnedOf(baseline), META),
      baseline.length,
    );
    expect(decoded.kernelVersion).toBe(META.kernelVersion);
    expect(decoded.task).toBe(META.task);
    expect(decoded.challenge).toBe(META.challenge);
    expect(decoded.family).toBe(META.family);
    expect(decoded.generation).toBe(352);
    expect(decoded.sigma).toBe(META.sigma);
  });

  test("a policy identical to the seed round-trips exactly", () => {
    const baseline = baselineOf(128);
    const decoded = decodeSharedPolicy(
      encodeSharedPolicy(baseline, META),
      baseline.length,
    );
    for (let index = 0; index < baseline.length; index++) {
      expect(decoded.policy[index]).toBe(baseline[index]);
    }
  });

  test("a few large coefficients must not quantise the thousands of tiny ones away", () => {
    // The distribution a real CMA policy actually has: a handful of large
    // deviations among thousands of very small ones. A fixed-point step sized
    // from the peak destroys the small ones — measured, that turned a 0.66 m
    // gait back into a 0.11 m one when it reached the browser.
    const baseline = baselineOf(4_096);
    const learned = Float64Array.from(baseline);
    for (let index = 0; index < learned.length; index++) {
      learned[index] += index % 512 === 0 ? 0.6 : 2e-6 * Math.cos(index);
    }
    const decoded = decodeSharedPolicy(encodeSharedPolicy(learned, META), learned.length);
    let worstRelative = 0;
    for (let index = 0; index < learned.length; index++) {
      const delta = learned[index] - baseline[index];
      const restored = decoded.policy[index] - baseline[index];
      if (Math.abs(delta) > 0) {
        worstRelative = Math.max(worstRelative, Math.abs(restored - delta) / Math.abs(delta));
      }
    }
    // Every coefficient keeps its own precision, large or small.
    expect(worstRelative).toBe(0);
  });

  test("precision adapts to how far the policy actually moved", () => {
    // A barely-moved policy must not be stored coarsely just because the format
    // could hold a much larger deviation.
    const baseline = baselineOf(256);
    const barely = learnedOf(baseline, 1e-6);
    const decoded = decodeSharedPolicy(encodeSharedPolicy(barely, META), barely.length);
    let worst = 0;
    for (let index = 0; index < barely.length; index++) {
      worst = Math.max(worst, Math.abs(decoded.policy[index] - barely[index]));
    }
    expect(worst).toBe(0);
  });

  test("refuses a payload that is not a policy", () => {
    const baseline = baselineOf(32);
    const junk = new Uint8Array(200);
    expect(() => decodeSharedPolicy(junk, baseline.length)).toThrow(/not a policy payload/);
  });

  test("refuses a policy sized for a different owner", () => {
    const baseline = baselineOf(64);
    const payload = encodeSharedPolicy(learnedOf(baseline), META);
    expect(() => decodeSharedPolicy(payload, 128)).toThrow(/expects 128/);
  });

  test("refuses a truncated payload rather than reconstructing nonsense", () => {
    const baseline = baselineOf(64);
    const payload = encodeSharedPolicy(learnedOf(baseline), META);
    expect(() => decodeSharedPolicy(payload.subarray(0, payload.length - 20), baseline.length)).toThrow(
      /does not match its header/,
    );
  });

  test("refuses non-finite coefficients at encode time", () => {
    const baseline = baselineOf(16);
    const broken = learnedOf(baseline);
    broken[3] = Number.NaN;
    expect(() => encodeSharedPolicy(broken, META)).toThrow(/non-finite/);
  });

  test("the fragment round-trips through compression and base64url", async () => {
    const baseline = baselineOf();
    const learned = learnedOf(baseline);
    const fragment = await encodePolicyFragment(learned, META);
    // base64url only: this has to survive being pasted into a URL.
    expect(fragment).toMatch(/^[A-Za-z0-9_-]+$/);
    const decoded = await decodePolicyFragment(fragment, baseline.length);
    let worst = 0;
    for (let index = 0; index < learned.length; index++) {
      worst = Math.max(worst, Math.abs(decoded.policy[index] - learned[index]));
    }
    expect(worst).toBe(0);
    expect(decoded.generation).toBe(352);
  });

  test("a truncated share link says so in words a sender can act on", async () => {
    const baseline = baselineOf(512);
    const fragment = await encodePolicyFragment(learnedOf(baseline), META);
    const truncated = fragment.slice(0, Math.floor(fragment.length / 2));
    await expect(decodePolicyFragment(truncated, baseline.length)).rejects.toThrow();
  });

  test("reads the policy out of a location hash, and ignores hashes without one", () => {
    expect(policyFragmentFromHash("#zpolicy=abc123")).toBe("abc123");
    expect(policyFragmentFromHash("#view=max&zpolicy=xyz")).toBe("xyz");
    expect(policyFragmentFromHash("#view=max")).toBeNull();
    expect(policyFragmentFromHash("")).toBeNull();
    expect(policyFragmentFromHash("#plain-anchor")).toBeNull();
  });

  test("builds a share URL that keeps the payload in the fragment", () => {
    const url = policyShareUrl("https://cmaes.org", "/humanoid", "PAYLOAD");
    expect(url).toBe("https://cmaes.org/humanoid#zpolicy=PAYLOAD");
    // Everything after the hash stays client-side; nothing is sent to a server.
    expect(url.split("#")[0]).not.toContain("PAYLOAD");
  });

  test("a policy file keeps full precision like the link", () => {
    const baseline = baselineOf(512);
    const learned = learnedOf(baseline);
    const file = policyFileContents(learned, META, {
      distanceMeters: 0.66,
      speedMetersPerSecond: 0.44,
      metersPerKilojoule: 0.055,
      energyJoules: 12_020,
    });
    const restored = policyFromFileContents(JSON.stringify(file), learned.length);
    for (let index = 0; index < learned.length; index++) {
      expect(restored.policy[index]).toBe(learned[index]);
    }
    expect(restored.generation).toBe(352);
    expect(file.measured?.distanceMeters).toBe(0.66);
  });

  test("preserves cancellation cases, extreme finite values and signed zero bit for bit", async () => {
    const policy = Float64Array.of(1e-20, -0, 0, Number.MIN_VALUE, -Number.MIN_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, Math.PI);
    const fragment = await encodePolicyFragment(policy, META);
    const copies = [
      decodeSharedPolicy(encodeSharedPolicy(policy, META), policy.length),
      await decodePolicyFragment(fragment, policy.length),
      policyFromFileContents(JSON.stringify(policyFileContents(policy, META)), policy.length),
    ];
    for (const copy of copies) {
      expect(new Uint8Array(copy.policy.buffer)).toEqual(new Uint8Array(policy.buffer));
    }
  });

  test("rejects invalid metadata and binary format instead of truncating fields", () => {
    const policy = Float64Array.of(1);
    for (const bad of [
      { generation: -1 }, { generation: 2 ** 32 }, { generation: 1.5 },
      { sigma: NaN }, { sigma: 0 }, { sigma: Infinity },
      // Provenance strings are checked structurally, not against one robot's
      // vocabulary: this format carries manipulation policies too, and
      // whitelisting walking task names refused the arm's own exports.
      { task: "" }, { challenge: "   " }, { family: "f".repeat(256) },
      { kernelVersion: "x".repeat(256) },
    ]) expect(() => encodeSharedPolicy(policy, { ...META, ...bad } as SharedPolicyMeta)).toThrow();
    // A manipulation policy is valid provenance, not a foreign object.
    expect(() =>
      encodeSharedPolicy(policy, {
        ...META,
        task: "kitchen-mug",
        challenge: "household",
        family: "full",
      }),
    ).not.toThrow();
    const payload = encodeSharedPolicy(policy, META);
    const view = new DataView(payload.buffer);
    view.setUint16(4, 3, true);
    expect(() => decodeSharedPolicy(payload, 1)).toThrow("unsupported policy format");
    view.setUint16(4, 4, true);
    view.setFloat64(payload.length - 8, Infinity, true);
    expect(() => decodeSharedPolicy(payload, 1)).toThrow("non-finite");
  });

  test("rejects malformed JSON roots, versions, metadata and oversized payloads", async () => {
    for (const root of ["null", "0", "true", "[]", '"policy"']) {
      expect(() => policyFromFileContents(root, 1)).toThrow("not a Frankensim G1 policy");
    }
    const file = policyFileContents(Float64Array.of(1), META);
    expect(() => policyFromFileContents(JSON.stringify({ ...file, formatVersion: 99 }), 1)).toThrow("unsupported format");
    expect(() => policyFromFileContents(JSON.stringify({ ...file, sigma: null }), 1)).toThrow("search radius");
    expect(() => policyFromFileContents(" ".repeat(2_000_001), 1)).toThrow("too large");
    await expect(decodePolicyFragment("a".repeat(800_000), 1)).rejects.toThrow();
    const compressedBomb = new Uint8Array(await new Response(new Blob([new Uint8Array(600_000)]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer());
    const encoded = btoa(String.fromCharCode(...compressedBomb)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    await expect(decodePolicyFragment(encoded, 1)).rejects.toThrow("decoded payload is too large");
  });

  test("refuses files that are not policies, with a reason", () => {
    expect(() => policyFromFileContents("not json", 8)).toThrow(/not valid JSON/);
    expect(() => policyFromFileContents(JSON.stringify({ hello: 1 }), 8)).toThrow(
      /not a Frankensim G1 policy/,
    );
    expect(() =>
      policyFromFileContents(
        JSON.stringify({ format: "frankensim-g1-policy", policy: [1, 2] }),
        8,
      ),
    ).toThrow(/expects 8/);
    expect(() =>
      policyFromFileContents(
        JSON.stringify({ format: "frankensim-g1-policy", policy: [1, null] }),
        2,
      ),
    ).toThrow(/not a finite number/);
  });
});
