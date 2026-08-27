/**
 * NAS demo objective: the transformer-architecture surrogate that the
 * TransformerViz component's 5D CMA-ES searches. Lives in lib/ (like the
 * wing and bridge objectives in frankensimPhysics) so the view component
 * exports only components and the engine tests can import the objective
 * directly.
 */

export type AttentionType = "MHA" | "GQA" | "MQA";
export type ActivationType = "SwiGLU" | "GELU" | "Mish";

export interface ArchPoint {
  id: number;
  layers: number;
  dim: number;
  heads: number;
  attnType: AttentionType;
  actType: ActivationType;
  paramsM: number;
  flopsGiga: number;
  valLoss: number;
  latencyMs: number;
  isPareto: boolean;
  generation?: number;
}

// Decode continuous latent vector z in [0, 1]^5 to physical model architecture
export function decodeVectorToArch(z: number[]): ArchPoint {
  const zL = Math.max(0, Math.min(1, z[0] ?? 0.45));
  const zD = Math.max(0, Math.min(1, z[1] ?? 0.48));
  const zH = Math.max(0, Math.min(1, z[2] ?? 0.4));
  const zAttn = Math.max(0, Math.min(1, z[3] ?? 0.5));
  const zAct = Math.max(0, Math.min(1, z[4] ?? 0.2));

  const layers = Math.max(2, Math.min(16, Math.round(2 + zL * 14)));
  const dim = Math.max(128, Math.min(1024, Math.round(128 + zD * 896)));
  const heads = Math.max(2, Math.min(16, Math.round(2 + zH * 14)));
  const attnType: AttentionType = zAttn < 0.33 ? "MHA" : zAttn < 0.67 ? "GQA" : "MQA";
  const actType: ActivationType = zAct < 0.33 ? "SwiGLU" : zAct < 0.67 ? "GELU" : "Mish";

  // Transformer parameter count: tied embeddings plus per-layer attention and
  // MLP blocks (this is a plain count, not a Chinchilla scaling-law fit).
  const vocab = 32000;
  const dFF = actType === "SwiGLU" ? Math.round((8 / 3) * dim) : 4 * dim;
  const attnFactor = attnType === "MHA" ? 4 : attnType === "GQA" ? 2.5 : 2;
  const attnParamsPerLayer = attnFactor * dim * dim;
  const mlpParamsPerLayer = (actType === "SwiGLU" ? 3 : 2) * dim * dFF;
  const totalParams = vocab * dim + layers * (attnParamsPerLayer + mlpParamsPerLayer + 4 * dim);
  const paramsM = totalParams / 1e6;

  // GFLOPs per forward pass ~ 2*N*T (batch 1, 2048 sequence). The generous
  // clamp exists only to guard degenerate inputs; it never binds for real
  // decodes, so the compute penalty keeps its gradient everywhere.
  const flopsGiga = Math.max(1, Math.min(2000, (2 * totalParams * 2048) / 1e9));
  // Hand-written surrogates: valLoss and latencyMs are toy closed forms for
  // the demo, not measurements from training runs.
  const valLoss = Math.max(
    1.08,
    1.12 + 3.2 / Math.sqrt(layers * 0.7 + (dim / 128) * 2.2) +
      (attnType === "MQA" ? 0.06 : attnType === "GQA" ? 0.02 : 0) +
      (actType === "GELU" ? 0.06 : actType === "Mish" ? 0.03 : 0)
  );
  // The mild per-head latency term stands in for scheduling and kernel-launch
  // overhead in this surrogate; mainly it keeps z[2] from being a null
  // direction the optimizer merely diffuses along.
  const latencyMs = layers * 0.75 + (dim / 256) * 1.1 + heads * 0.12 + (attnType === "MHA" ? 0.4 : 0);

  return {
    id: 0,
    layers,
    dim,
    heads,
    attnType,
    actType,
    paramsM,
    flopsGiga,
    valLoss,
    latencyMs,
    isPareto: false
  };
}

// Weighted-sum scalarization of accuracy vs compute and latency. One fixed weight means
// the search converges to ONE point on the trade-off curve; the empirical
// Pareto set shown in the chart comes from all evaluated architectures.
export function evaluateArchFitness(z: number[]): number {
  const arch = decodeVectorToArch(z);
  // The latency term makes head count a real search dimension instead of a
  // coordinate along which the objective was exactly flat.
  return arch.valLoss + 0.00032 * arch.flopsGiga + 0.005 * arch.latencyMs;
}
