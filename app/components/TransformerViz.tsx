"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Play, Pause, Sparkles, BrainCircuit, Activity, Zap, BarChart2, Compass } from "lucide-react";
import { CMAESOptimizer } from "../lib/cmaesEngine";

// --- 3D Architecture Visuals ---

function DataPacket({ path }: { path: THREE.Vector3[] }) {
  const ref = useRef<THREE.Mesh>(null);
  const { speed, offset } = useMemo(() => {
    const seed = path.length * 17.13;
    const r = Math.sin(seed) * 10000;
    const norm = r - Math.floor(r);
    return {
      speed: 0.8 + norm * 0.4,
      offset: norm
    };
  }, [path.length]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * speed + offset) % 1;
    const idx = t * (path.length - 1);
    const i = Math.floor(idx);
    const alpha = idx - i;

    if (i < path.length - 1) {
      ref.current.position.lerpVectors(path[i], path[i + 1], alpha);
    }
    const s = 0.05 + Math.sin(t * Math.PI) * 0.04;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a78bfa" />
    </mesh>
  );
}

function LayerConnection({ start, end, activity }: { start: THREE.Vector3; end: THREE.Vector3; activity: number }) {
  const { curvePoints, shouldSpawn } = useMemo(() => {
    const mid = start.clone().lerp(end, 0.5);
    mid.y += start.distanceTo(end) * 0.2;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return {
      curvePoints: curve.getPoints(16),
      shouldSpawn: activity > 0.4
    };
  }, [start, end, activity]);

  return (
    <group>
      <line>
        <bufferGeometry setFromPoints={curvePoints} />
        <lineBasicMaterial color="#6366f1" opacity={0.35 + activity * 0.4} transparent linewidth={1} />
      </line>
      {shouldSpawn && <DataPacket path={curvePoints} />}
    </group>
  );
}

function NetworkTopology({ depth, width, heads }: { depth: number; width: number; heads: number }) {
  const layerCount = Math.max(3, Math.round(2 + depth * 5)); // 3 to 7 layers
  const nodeCount = Math.max(3, Math.round(2 + width * 6)); // 3 to 8 nodes per layer

  const layers = useMemo(() => {
    const ls: THREE.Vector3[][] = [];
    for (let l = 0; l < layerCount; l++) {
      const z = (l / (layerCount - 1 || 1) - 0.5) * 3.5;
      const spread = 1.6 + width * 1.4;
      const nodes: THREE.Vector3[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const x = (i / (nodeCount - 1 || 1) - 0.5) * spread;
        const y = Math.cos(x * 0.8 + l) * 0.35;
        nodes.push(new THREE.Vector3(x, y, z));
      }
      ls.push(nodes);
    }
    return ls;
  }, [width, layerCount, nodeCount]);

  return (
    <group>
      {layers.map((nodes, i) => (
        <group key={`layer-group-${i}-${nodes.length}`}>
          {nodes.map((pos) => (
            <mesh key={`node-point-${pos.x.toFixed(2)}-${pos.z.toFixed(2)}`} position={pos}>
              <boxGeometry args={[0.18, 0.18, 0.06]} />
              <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
          ))}
          {i > 0 && (
            <Connections from={layers[i - 1]} to={nodes} density={heads} />
          )}
        </group>
      ))}
    </group>
  );
}

function Connections({ from, to, density }: { from: THREE.Vector3[]; to: THREE.Vector3[]; density: number }) {
  const els = [];
  for (let i = 0; i < from.length; i++) {
    for (let j = 0; j < to.length; j++) {
      const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      if (hash - Math.floor(hash) < 0.35 + density * 0.55) {
        els.push(
          <LayerConnection
            key={`conn-${from[i].x.toFixed(2)}-${from[i].z.toFixed(2)}-${to[j].x.toFixed(2)}-${to[j].z.toFixed(2)}`}
            start={from[i]}
            end={to[j]}
            activity={0.8}
          />
        );
      }
    }
  }
  return <group>{els}</group>;
}

// --- Multi-Objective Pareto Frontier Canvas ---

interface ArchPoint {
  id: number;
  depth: number;
  width: number;
  heads: number;
  flopsGiga: number;
  valLoss: number;
  isPareto: boolean;
}

function ParetoFrontierChart({
  currentDepth,
  currentWidth,
  currentHeads,
  evaluatedArchs
}: {
  currentDepth: number;
  currentWidth: number;
  currentHeads: number;
  evaluatedArchs: ArchPoint[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    // Axes
    const PADDING = 36;
    const toPxX = (flops: number) => PADDING + ((flops - 5) / 50) * (W - 2 * PADDING);
    const toPxY = (loss: number) => H - PADDING - ((loss - 1.2) / 2.8) * (H - 2 * PADDING);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let f = 10; f <= 50; f += 10) {
      ctx.beginPath();
      ctx.moveTo(toPxX(f), PADDING);
      ctx.lineTo(toPxX(f), H - PADDING);
      ctx.stroke();
    }
    for (let l = 1.5; l <= 3.5; l += 0.5) {
      ctx.beginPath();
      ctx.moveTo(PADDING, toPxY(l));
      ctx.lineTo(W - PADDING, toPxY(l));
      ctx.stroke();
    }

    // Draw Evaluated Candidate Points
    evaluatedArchs.forEach((pt) => {
      const px = toPxX(pt.flopsGiga);
      const py = toPxY(pt.valLoss);

      if (pt.isPareto) {
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Current Selected Architecture Point
    const curLayers = Math.round(2 + currentDepth * 5);
    const curDim = Math.round(128 + currentWidth * 512);
    const curHeads = Math.round(2 + currentHeads * 6);
    const curFlops = (curLayers * curDim * curDim * 12) / 1e5;
    const curLoss = 1.4 + 1.2 / Math.sqrt(curLayers * 0.4 + curDim * 0.005) + Math.abs(curHeads - 6) * 0.05;

    const curPx = toPxX(curFlops);
    const curPy = toPxY(curLoss);

    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(curPx, curPy, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Compute Cost (GFLOPs) →", W - 140, H - 10);
    ctx.save();
    ctx.translate(14, 120);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Validation Loss (Lower is Better) →", 0, 0);
    ctx.restore();
  }, [currentDepth, currentWidth, currentHeads, evaluatedArchs]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200">
        <span className="flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5 text-purple-400" />
          Pareto Frontier: Accuracy vs FLOPs
        </span>
        <span className="text-[0.68rem] text-emerald-400 font-mono font-normal">
          ● Pareto Optimal Designs
        </span>
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-[#030712]">
        <canvas ref={canvasRef} width={420} height={240} className="w-full h-auto block" />
      </div>
    </div>
  );
}

// --- Main TransformerViz Component ---

export function TransformerViz() {
  const [depth, setDepth] = useState(0.55);
  const [width, setWidth] = useState(0.5);
  const [heads, setHeads] = useState(0.45);
  const [activation, setActivation] = useState<"SwiGLU" | "GELU" | "ReLU" | "Mish">("SwiGLU");

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);

  // Generate initial population of evaluated architectures for Pareto visualization
  const initialArchs = useMemo(() => {
    const pts: ArchPoint[] = [];
    for (let i = 0; i < 40; i++) {
      const s1 = Math.sin(i * 12.9898 + 1.234) * 43758.5453;
      const s2 = Math.sin(i * 78.233 + 4.567) * 43758.5453;
      const s3 = Math.sin(i * 39.346 + 9.876) * 43758.5453;
      const d = s1 - Math.floor(s1);
      const w = s2 - Math.floor(s2);
      const h = s3 - Math.floor(s3);
      const layers = Math.round(2 + d * 5);
      const dim = Math.round(128 + w * 512);
      const hd = Math.round(2 + h * 6);
      const flops = (layers * dim * dim * 12) / 1e5;
      const loss = 1.4 + 1.2 / Math.sqrt(layers * 0.4 + dim * 0.005) + Math.abs(hd - 6) * 0.05 + (d - 0.5) * 0.08;
      pts.push({
        id: i,
        depth: d,
        width: w,
        heads: h,
        flopsGiga: flops,
        valLoss: loss,
        isPareto: false
      });
    }
    // Calculate Pareto frontier
    pts.forEach((p1) => {
      const dominated = pts.some(
        (p2) => p2.flopsGiga <= p1.flopsGiga && p2.valLoss <= p1.valLoss && (p2.flopsGiga < p1.flopsGiga || p2.valLoss < p1.valLoss)
      );
      p1.isPareto = !dominated;
    });
    return pts;
  }, []);

  const [archList, setArchList] = useState<ArchPoint[]>(initialArchs);

  // Discrete parameters
  const layersCount = Math.round(2 + depth * 5);
  const hiddenDim = Math.round(128 + width * 512);
  const attentionHeads = Math.round(2 + heads * 6);
  const estFlops = ((layersCount * hiddenDim * hiddenDim * 12) / 1e5).toFixed(1);

  const optIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    };
  }, []);

  // Run live CMA-ES NAS Optimization
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
      setIsOptimizing(false);
      return;
    }
    setIsOptimizing(true);
    setOptGen(0);

    // Multi-objective blended cost: Loss + 0.02 * FLOPs
    const optimizer = new CMAESOptimizer(
      (d, w) => {
        const l = Math.round(2 + d * 5);
        const dm = Math.round(128 + w * 512);
        const fl = (l * dm * dm * 12) / 1e5;
        const loss = 1.4 + 1.2 / Math.sqrt(l * 0.4 + dm * 0.005);
        return loss + 0.015 * fl;
      },
      {
        dim: 2,
        initialMean: [depth, width],
        initialSigma: 0.25,
        lambda: 12,
        bounds: [0.0, 1.0]
      }
    );

    let g = 0;
    const maxG = 20;
    if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    optIntervalRef.current = setInterval(() => {
      g++;
      const state = optimizer.step();
      const newD = Math.max(0, Math.min(1, state.bestX[0]));
      const newW = Math.max(0, Math.min(1, state.bestX[1]));
      setDepth(newD);
      setWidth(newW);
      setOptGen(g);

      // Add to evaluated list and recalculate Pareto frontier
      const l = Math.round(2 + newD * 5);
      const dm = Math.round(128 + newW * 512);
      const fl = (l * dm * dm * 12) / 1e5;
      const ls = 1.4 + 1.2 / Math.sqrt(l * 0.4 + dm * 0.005);
      setArchList((prev) => {
        const nextList: ArchPoint[] = [
          ...prev,
          { id: prev.length, depth: newD, width: newW, heads, flopsGiga: fl, valLoss: ls, isPareto: false }
        ];
        nextList.forEach((p1) => {
          const dominated = nextList.some(
            (p2) =>
              p2.flopsGiga <= p1.flopsGiga &&
              p2.valLoss <= p1.valLoss &&
              (p2.flopsGiga < p1.flopsGiga || p2.valLoss < p1.valLoss)
          );
          p1.isPareto = !dominated;
        });
        return nextList;
      });

      if (g >= maxG) {
        if (optIntervalRef.current) clearInterval(optIntervalRef.current);
        setIsOptimizing(false);
      }
    }, 200);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Visualizer */}
        <div className="w-full lg:w-[60%] relative group aspect-[16/10] sm:aspect-auto lg:h-[480px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#030014]">
            <Canvas dpr={[1, 2]} events={safePointerEvents}>
              <PerspectiveCamera makeDefault position={[4.6, 2.2, 4.6]} fov={40} />
              <color attach="background" args={["#030014"]} />
              <fog attach="fog" args={["#030014", 6, 20]} />

              <ambientLight intensity={0.3} />
              <pointLight position={[6, 6, 6]} intensity={1.2} color="#2dd4bf" />
              <pointLight position={[-6, -6, -6]} intensity={0.6} color="#a78bfa" />

              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.06}
                minDistance={3.0}
                maxDistance={12}
                maxPolarAngle={Math.PI / 2 + 0.05}
                target={[0, 0, 0]}
              />

              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                  <NetworkTopology depth={depth} width={width} heads={heads} />
                </group>
              </Float>

              <gridHelper position={[0, -2, 0]} args={[20, 20, "#1e1b4b", "#0f172a"]} />
            </Canvas>

            {/* Orbit & Interaction Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[0.62rem] sm:text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
              <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-400" />
              <span>Drag to orbit</span>
            </div>

            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 text-[0.65rem] sm:text-xs font-mono text-violet-300">
              <BrainCircuit className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-400" />
              <span>{layersCount}L • {hiddenDim}D • {attentionHeads}H</span>
            </div>

            {isOptimizing && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-purple-500/40 shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-[0.68rem] sm:text-xs font-mono font-bold text-purple-200">
                  NAS CMA-ES: Gen {optGen}/20
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Pareto Frontier */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              <BrainCircuit className="h-4 w-4" />
              <span>Mixed-Integer NAS & Hyperparameter Space</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Searching non-differentiable discrete architecture topologies by embedding all choices into a continuous <code className="text-xs font-mono bg-white/10 px-1 py-0.5 rounded">[0, 1]ⁿ</code> box.
            </p>
          </div>

          {/* Continuous Hyperparameter Sliders */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Continuous Architecture Dimensions</span>
            </h4>

            {/* Depth Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Depth (Layers)</span>
                <span className="text-teal-400 font-mono font-bold">
                  {Math.max(3, Math.round(2 + depth * 5))} layers
                </span>
              </div>
              <input
                type="range"
                aria-label="Depth (Layers)"
                min="0"
                max="1"
                step="0.01"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>

            {/* Width Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Width (Hidden Dim)</span>
                <span className="text-indigo-400 font-mono font-bold">
                  d_model = {Math.round(128 + width * 512)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Width (Hidden Dim)"
                min="0"
                max="1"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>

            {/* Attention Heads Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Attention Heads</span>
                <span className="text-purple-400 font-mono font-bold">
                  {Math.max(2, Math.round(1 + heads * 7) * 2)} heads
                </span>
              </div>
              <input
                type="range"
                aria-label="Attention Heads"
                min="0"
                max="1"
                step="0.01"
                value={heads}
                onChange={(e) => setHeads(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Categorical Activation Choice */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <div className="text-xs font-medium text-slate-300">Activation Function (Categorical)</div>
              <div className="grid grid-cols-4 gap-1.5">
                {(["SwiGLU", "GELU", "ReLU", "Mish"] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => setActivation(act)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activation === act
                        ? "bg-purple-500 text-white shadow-glow-sm"
                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pareto Frontier Multi-Objective Chart */}
          <ParetoFrontierChart
            currentDepth={depth}
            currentWidth={width}
            currentHeads={heads}
            evaluatedArchs={archList}
          />

          <button
            onClick={handleRunOptimizer}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all shadow-lg ${
              isOptimizing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-purple-500 to-teal-500 hover:scale-[1.02] shadow-purple-500/30"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isOptimizing ? "Stop Architecture Search" : "Run Live CMA-ES Architecture Search"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
