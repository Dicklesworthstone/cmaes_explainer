/**
 * Taking a learned policy with you.
 *
 * A trained gait is hours of somebody's compute. It should not evaporate when
 * the tab closes, and showing it to someone else should not mean telling them
 * to run the search again. Two ways out, with different tradeoffs:
 *
 *   - A policy FILE: full float64, exact, no size limit. What you keep.
 *   - A share LINK: the policy quantised into the URL fragment. What you send.
 *
 * The link carries the DELTA from the curriculum seed rather than the policy
 * itself: learned policies sit close to the seed, so the delta is small and
 * compresses better than absolute coefficients.
 *
 * The delta is stored as float64 — exactly. Two cheaper encodings were tried
 * against the real thing and both failed, because a 720-step contact-rich
 * rollout amplifies tiny perturbations:
 *
 *   16-bit fixed point stepped from the largest deviation: a CMA policy has a
 *   handful of large coefficients among thousands of tiny ones, so the small
 *   ones quantised to zero and a 0.66 m gait came back as 0.11 m.
 *
 *   float32, roughly seven digits per coefficient: closer, but the restored
 *   policy fell at 1.40 s instead of surviving the 1.50 s horizon, and walked
 *   0.57 m instead of 0.66 m.
 *
 * So the link is large — tens of kilobytes — and it carries the gait that was
 * actually trained rather than one that merely resembles it. The UI says so.
 *
 * The fragment codec deliberately matches franken-markdown's: deflate-raw
 * inside base64url, in the hash so the payload never reaches a server.
 */

/** Magic word identifying a G1 policy payload: "G1P\0" as little-endian u32. */
const POLICY_MAGIC = 0x00503147;
const POLICY_FORMAT_VERSION = 3;
/** Header words before the quantised payload, in bytes. */
const HEADER_BYTES = 32;

export interface SharedPolicyMeta {
  /** Owner kernel the policy was trained against, e.g. "fs-cmaes-viz-wasm 0.6.19". */
  kernelVersion: string;
  task: string;
  challenge: string;
  family: string;
  /** CMA generation the policy was taken from. */
  generation: number;
  /** Search radius the run used. */
  sigma: number;
}

export interface SharedPolicy extends SharedPolicyMeta {
  /** Full policy coefficients, reconstructed. */
  policy: Float64Array;
}

/** A policy file: JSON, exact, and readable by anything. */
export interface PolicyFile extends SharedPolicyMeta {
  format: "frankensim-g1-policy";
  formatVersion: number;
  /** ISO 8601 timestamp of export. */
  exportedAt: string;
  /** Physical summary at export, for a human reading the file. */
  measured?: {
    distanceMeters: number;
    speedMetersPerSecond: number | null;
    metersPerKilojoule: number | null;
    energyJoules: number;
  };
  policy: number[];
}

function textBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

/** Store `policy - baseline` as float32, which is exact enough per coefficient. */
export function encodeSharedPolicy(
  policy: Float64Array,
  baseline: Float64Array,
  meta: SharedPolicyMeta,
): Uint8Array {
  if (policy.length !== baseline.length) {
    throw new Error("policy share: policy and baseline lengths differ");
  }
  if (policy.length === 0) throw new Error("policy share: empty policy");
  if (!policy.every(Number.isFinite) || !baseline.every(Number.isFinite)) {
    throw new Error("policy share: non-finite coefficient");
  }

  const kernelBytes = textBytes(meta.kernelVersion);
  const taskBytes = textBytes(meta.task);
  const challengeBytes = textBytes(meta.challenge);
  const familyBytes = textBytes(meta.family);
  // Lengths live in the header, so the strings themselves carry no prefix.
  const stringBytes =
    kernelBytes.length + taskBytes.length + challengeBytes.length + familyBytes.length;

  const bytes = new Uint8Array(HEADER_BYTES + stringBytes + policy.length * 8);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, POLICY_MAGIC, true);
  view.setUint16(4, POLICY_FORMAT_VERSION, true);
  view.setUint16(6, policy.length, true);
  view.setUint32(8, meta.generation, true);
  // 12..19 reserved (previously a fixed-point scale).
  view.setFloat64(12, 0, true);
  view.setFloat32(20, meta.sigma, true);
  view.setUint8(24, kernelBytes.length);
  view.setUint8(25, taskBytes.length);
  view.setUint8(26, challengeBytes.length);
  view.setUint8(27, familyBytes.length);
  // 28..31 reserved, left zero.

  let cursor = HEADER_BYTES;
  for (const part of [kernelBytes, taskBytes, challengeBytes, familyBytes]) {
    bytes.set(part, cursor);
    cursor += part.length;
  }
  for (let index = 0; index < policy.length; index++) {
    view.setFloat64(cursor + index * 8, policy[index] - baseline[index], true);
  }
  return bytes;
}

/** Rebuild a policy from its payload and the baseline it was measured against. */
export function decodeSharedPolicy(bytes: Uint8Array, baseline: Float64Array): SharedPolicy {
  if (bytes.length < HEADER_BYTES + 4) {
    throw new Error("policy share: payload is too short to be a policy");
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== POLICY_MAGIC) {
    throw new Error("policy share: this is not a policy payload");
  }
  const formatVersion = view.getUint16(4, true);
  if (formatVersion !== POLICY_FORMAT_VERSION) {
    throw new Error(
      `policy share: unsupported policy format v${formatVersion} (this page reads v${POLICY_FORMAT_VERSION})`,
    );
  }
  const count = view.getUint16(6, true);
  if (count !== baseline.length) {
    throw new Error(
      `policy share: policy has ${count} coefficients but this owner expects ${baseline.length}`,
    );
  }
  const generation = view.getUint32(8, true);
  const sigma = view.getFloat32(20, true);
  const lengths = [view.getUint8(24), view.getUint8(25), view.getUint8(26), view.getUint8(27)];
  const stringTotal = lengths.reduce((sum, value) => sum + value, 0);
  if (bytes.length !== HEADER_BYTES + stringTotal + count * 8) {
    throw new Error("policy share: payload length does not match its header");
  }

  const decoder = new TextDecoder();
  let cursor = HEADER_BYTES;
  const parts = lengths.map((length) => {
    const value = decoder.decode(bytes.subarray(cursor, cursor + length));
    cursor += length;
    return value;
  });

  const policy = new Float64Array(count);
  for (let index = 0; index < count; index++) {
    policy[index] = baseline[index] + view.getFloat64(cursor + index * 8, true);
  }
  return {
    kernelVersion: parts[0],
    task: parts[1],
    challenge: parts[2],
    family: parts[3],
    generation,
    sigma,
    policy,
  };
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  const CHUNK = 0x8000;
  for (let index = 0; index < bytes.length; index += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(text: string): Uint8Array {
  const padded = text
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(text.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function pipeBytes(
  bytes: Uint8Array,
  Transform: typeof CompressionStream | typeof DecompressionStream,
  mode: string,
): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new (Transform as typeof CompressionStream)(mode as CompressionFormat));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** The `zpolicy` fragment value for a policy: deflate-raw inside base64url. */
export async function encodePolicyFragment(
  policy: Float64Array,
  baseline: Float64Array,
  meta: SharedPolicyMeta,
): Promise<string> {
  const raw = encodeSharedPolicy(policy, baseline, meta);
  if (typeof CompressionStream === "undefined") return base64UrlEncode(raw);
  return base64UrlEncode(await pipeBytes(raw, CompressionStream, "deflate-raw"));
}

/**
 * Read a `zpolicy` fragment value.
 *
 * Errors are worded for the person holding a broken link, because the usual
 * cause is not corruption but a chat app shortening a long URL.
 */
export async function decodePolicyFragment(
  fragment: string,
  baseline: Float64Array,
): Promise<SharedPolicy> {
  let bytes: Uint8Array;
  try {
    bytes = base64UrlDecode(fragment);
  } catch {
    throw new Error(
      "This share link is not readable. Some chat apps shorten long links — ask the sender for the full one.",
    );
  }
  if (typeof DecompressionStream !== "undefined") {
    try {
      return decodeSharedPolicy(await pipeBytes(bytes, DecompressionStream, "deflate-raw"), baseline);
    } catch (error) {
      // Fall through to the uncompressed reading before giving up: a link made
      // in a browser without CompressionStream is stored raw.
      try {
        return decodeSharedPolicy(bytes, baseline);
      } catch {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  }
  return decodeSharedPolicy(bytes, baseline);
}

/** Build the shareable URL for a policy fragment. */
export function policyShareUrl(origin: string, pathname: string, fragment: string): string {
  return `${origin}${pathname}#zpolicy=${fragment}`;
}

/** Read a policy fragment out of a location hash, if one is present. */
export function policyFragmentFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw.includes("=")) return null;
  return new URLSearchParams(raw).get("zpolicy");
}

/** The exact, unquantised form, for keeping rather than sending. */
export function policyFileContents(
  policy: Float64Array,
  meta: SharedPolicyMeta,
  measured?: PolicyFile["measured"],
): PolicyFile {
  return {
    format: "frankensim-g1-policy",
    formatVersion: POLICY_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    ...meta,
    measured,
    policy: Array.from(policy),
  };
}

/** Read a policy file back, refusing anything that is not one. */
export function policyFromFileContents(text: string, expectedLength: number): SharedPolicy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("That file is not a policy: it is not valid JSON.");
  }
  const file = parsed as Partial<PolicyFile>;
  if (file.format !== "frankensim-g1-policy") {
    throw new Error("That file is not a Frankensim G1 policy.");
  }
  if (!Array.isArray(file.policy)) {
    throw new Error("That policy file has no coefficients.");
  }
  if (file.policy.length !== expectedLength) {
    throw new Error(
      `That policy has ${file.policy.length} coefficients but this owner expects ${expectedLength}.`,
    );
  }
  if (!file.policy.every((value) => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("That policy file contains a coefficient that is not a finite number.");
  }
  return {
    kernelVersion: file.kernelVersion ?? "unknown",
    task: file.task ?? "walking",
    challenge: file.challenge ?? "terrain-and-push",
    family: file.family ?? "lm-ma",
    generation: file.generation ?? 0,
    sigma: file.sigma ?? 0,
    policy: Float64Array.from(file.policy),
  };
}
