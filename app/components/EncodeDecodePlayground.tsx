"use client";

import { useMemo, useState } from "react";
import { Layers, Shuffle, Sparkles, Cpu, Binary, Gauge, ArrowRight, CheckCircle2 } from "lucide-react";
import { MathJax } from "better-react-mathjax";

const activations = ["SwiGLU", "GELU", "ReLU", "Mish"] as const;
const optimizers = ["AdamW", "Lion", "Muon", "SGD-Momentum"] as const;

export function EncodeDecodePlayground() {
  const [zLr, setZLr] = useState(0.55); // Continuous log-scale [1e-5, 1e-1]
  const [zAct, setZAct] = useState(0.35); // Categorical discrete [0, 1] -> 4 bins
  const [zLayers, setZLayers] = useState(0.42); // Integer discrete [6, 48]
  const [zWeightDecay, setZWeightDecay] = useState(0.68); // Continuous linear [0.0, 0.2]

  // Decoded physical configurations
  const decoded = useMemo(() => {
    // 1. Log-scale learning rate
    const minLr = 1e-5;
    const maxLr = 1e-1;
    const lr = Math.exp(Math.log(minLr) + zLr * (Math.log(maxLr) - Math.log(minLr)));

    // 2. Categorical activation function
    const actIdx = Math.min(activations.length - 1, Math.floor(zAct * activations.length));
    const act = activations[actIdx];

    // 3. Discrete layer count
    const minLayers = 6;
    const maxLayers = 48;
    const layers = Math.floor(minLayers + zLayers * (maxLayers - minLayers + 1));

    // 4. Weight decay
    const wd = zWeightDecay * 0.2;

    return { lr, act, actIdx, layers, wd };
  }, [zLr, zAct, zLayers, zWeightDecay]);

  // Sample a Gaussian offspring vector in unit cube
  const handleRandomSample = () => {
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const randNorm = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.3;
    setZLr(clamp01(zLr + randNorm()));
    setZAct(clamp01(zAct + randNorm()));
    setZLayers(clamp01(zLayers + randNorm()));
    setZWeightDecay(clamp01(zWeightDecay + randNorm()));
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Universal Encode/Decode Latent Box Mapping
            </h3>
            <p className="text-xs text-slate-400">
              Mapping mixed continuous, log-scale, and discrete integer knobs into an isotropic $[0, 1]^n$ unit cube
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomSample}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors shadow-glow-sm"
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Sample Gaussian Step</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Normalized Latent Box Inputs [0, 1] */}
        <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-300">
            <span>Latent Space Representation $z \in [0, 1]^4$</span>
            <span className="font-mono text-slate-500 text-[0.7rem]">Normalized</span>
          </div>

          {/* z1: Learning Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">$z_1$ (Log-scale Learning Rate)</span>
              <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {zLr.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              aria-label="Latent Learning Rate z1"
              min={0}
              max={1}
              step={0.01}
              value={zLr}
              onChange={(e) => setZLr(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          {/* z2: Categorical Activation */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">$z_2$ (Categorical Slicing)</span>
              <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {zAct.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              aria-label="Latent Activation Slice z2"
              min={0}
              max={1}
              step={0.01}
              value={zAct}
              onChange={(e) => setZAct(parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          {/* z3: Discrete Layers */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">$z_3$ (Discrete Integer Layers)</span>
              <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {zLayers.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              aria-label="Latent Layer Count z3"
              min={0}
              max={1}
              step={0.01}
              value={zLayers}
              onChange={(e) => setZLayers(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* z4: Weight Decay */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">$z_4$ (Linear Bounded Weight Decay)</span>
              <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {zWeightDecay.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              aria-label="Latent Weight Decay z4"
              min={0}
              max={1}
              step={0.01}
              value={zWeightDecay}
              onChange={(e) => setZWeightDecay(parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        {/* Decoded Real-World Physical Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span>Decoded Physical Hyperparameters</span>
            <span className="font-mono text-slate-500 text-[0.7rem]">Evaluation Form</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-sky-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono">Learning Rate ($\eta$)</div>
              <div className="text-base font-bold text-sky-200 font-mono">{decoded.lr.toExponential(3)}</div>
              <div className="text-[0.62rem] text-slate-500 font-mono">Log range [1e-5, 1e-1]</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-purple-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono">Activation Function</div>
              <div className="text-base font-bold text-purple-200">{decoded.act}</div>
              <div className="text-[0.62rem] text-slate-500 font-mono">Bin {decoded.actIdx + 1} of 4</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono">Transformer Layers ($L$)</div>
              <div className="text-base font-bold text-emerald-200 font-mono">{decoded.layers} Layers</div>
              <div className="text-[0.62rem] text-slate-500 font-mono">Integer [6, 48]</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono">Weight Decay</div>
              <div className="text-base font-bold text-amber-200 font-mono">{decoded.wd.toFixed(4)}</div>
              <div className="text-[0.62rem] text-slate-500 font-mono">Linear [0.0, 0.2]</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-sky-200 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Late Quantization Principle</span>
            </div>
            <p>
              By searching in the continuous unit box and only quantizing at the very moment of simulation evaluation, the probability distribution <MathJax inline>{"$\\mathcal{N}(m, \\sigma^2 C)$"}</MathJax> moves smoothly across discrete boundaries without gradient breakdown or combinatorial explosion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
