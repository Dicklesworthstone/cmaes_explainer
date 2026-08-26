"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Float, OrbitControls, Line } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useInView } from "../hooks/useScrollSpy";
import {
  Play,
  Pause,
  Sparkles,
  BrainCircuit,
  Activity,
  Zap,
  BarChart2,
  Compass,
  Layers,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Cpu,
  TrendingDown,
  Info
} from "lucide-react";
import { CMAESOptimizer } from "../lib/cmaesEngine";
import { LatexRenderer } from "./LatexRenderer";

// ============================================================================
// 1. Types & Architectural Models
// ============================================================================

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

// ============================================================================
// 2. 3D Neural Architecture Sub-Components (Three.js / R3F)
// ============================================================================

/**
 * Animated luminescent token packets traveling along residual bypass highways
 */
function ResidualStreamParticles({
  layerCount,
  layerSpacing,
  stackRadius
}: {
  layerCount: number;
  layerSpacing: number;
  stackRadius: number;
}) {
  const count = 48;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const totalHeight = (layerCount - 1) * layerSpacing + 1.2;
  const startY = -totalHeight / 2 - 0.2;

  const particleData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.4 + (i % 5) * 0.12;
      const offset = (i / count);
      const radiusOffset = ((i % 3) - 1) * 0.08;
      return { angle, speed, offset, radiusOffset };
    });
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = particleData[i];
      const progress = (time * p.speed + p.offset) % 1.0;
      const y = startY + progress * totalHeight;

      // Spiral gently along the residual highway perimeter
      const currentAngle = p.angle + progress * Math.PI * 0.5;
      const r = stackRadius + 0.35 + p.radiusOffset;
      const x = Math.cos(currentAngle) * r;
      const z = Math.sin(currentAngle) * r;

      dummy.position.set(x, y, z);
      const scale = (0.04 + Math.sin(progress * Math.PI) * 0.045);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      // Cyan to purple gradient as token ascends
      tempColor.setHSL(0.52 + progress * 0.25, 0.9, 0.65);
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/**
 * Multi-Head Attention Head Cluster in 3D
 */
function AttentionHeadCluster({
  headCount,
  attnType,
  radius,
  yPos
}: {
  headCount: number;
  attnType: AttentionType;
  radius: number;
  yPos: number;
}) {
  const heads = useMemo(() => {
    const arr = [];
    const count = Math.min(headCount, 16);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * (radius * 0.82);
      const z = Math.sin(angle) * (radius * 0.82);
      const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-x, 0, -z)];
      arr.push({ x, z, angle, linePoints });
    }
    return arr;
  }, [headCount, radius]);

  const color = attnType === "MHA" ? "#38bdf8" : attnType === "GQA" ? "#818cf8" : "#c084fc";
  const emissive = attnType === "MHA" ? "#0284c7" : attnType === "GQA" ? "#4f46e5" : "#7e22ce";

  return (
    <group position={[0, yPos, 0]}>
      {/* Central Query/Key Fusion Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.82, 0.02, 12, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Individual Attention Head Nodes */}
      {heads.map((h, idx) => (
        <group key={`head-${idx}-${h.x.toFixed(2)}`} position={[h.x, 0, h.z]}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={2.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Projection beam to center */}
          <line>
            <bufferGeometry setFromPoints={h.linePoints} />
            <lineBasicMaterial color={color} transparent opacity={0.35} />
          </line>
        </group>
      ))}

      {/* Core Attention Projection Hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

/**
 * Single Holographic Transformer Block in 3D
 */
function TransformerBlock3D({
  layerIndex,
  totalLayers,
  dim,
  heads,
  attnType,
  actType,
  layerSpacing
}: {
  layerIndex: number;
  totalLayers: number;
  dim: number;
  heads: number;
  attnType: AttentionType;
  actType: ActivationType;
  layerSpacing: number;
}) {
  const totalHeight = (totalLayers - 1) * layerSpacing;
  const yCenter = (layerIndex * layerSpacing) - totalHeight / 2;

  // Normalized width factor [0.8 to 1.8]
  const widthFactor = 0.75 + (dim / 1024) * 0.9;
  const mlpExpansion = actType === "SwiGLU" ? 1.45 : 1.25;

  return (
    <group position={[0, yCenter, 0]}>
      {/* 1. Input RMSNorm Ring */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[widthFactor * 0.75, 0.018, 12, 36]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#0d9488" emissiveIntensity={2.0} />
      </mesh>

      {/* 2. Multi-Head Attention Mechanism */}
      <AttentionHeadCluster
        headCount={heads}
        attnType={attnType}
        radius={widthFactor * 0.8}
        yPos={-0.08}
      />

      {/* 3. Mid-layer RMSNorm Ring */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[widthFactor * 0.75, 0.018, 12, 36]} />
        <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={2.0} />
      </mesh>

      {/* 4. SwiGLU / MLP Feed-Forward Core (Hexagonal Prism) */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[widthFactor * mlpExpansion * 0.55, widthFactor * mlpExpansion * 0.65, 0.14, 6]} />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#7e22ce"
          emissiveIntensity={1.2}
          transmission={0.65}
          roughness={0.2}
          thickness={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 5. Glass Enclosure Shield for the Transformer Layer */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[widthFactor * 1.05, widthFactor * 1.05, 0.62, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#0f172a"
          emissive="#38bdf8"
          emissiveIntensity={0.15}
          transmission={0.9}
          roughness={0.1}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Neon Layer Bounding Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[widthFactor * 1.04, widthFactor * 1.06, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * Complete 3D Holographic Transformer Stack
 */
function HolographicTransformerStack({
  layers,
  dim,
  heads,
  attnType,
  actType
}: {
  layers: number;
  dim: number;
  heads: number;
  attnType: AttentionType;
  actType: ActivationType;
}) {
  const stackRef = useRef<THREE.Group>(null);
  const layerSpacing = Math.max(0.72, Math.min(1.1, 4.2 / Math.max(2, layers)));
  const widthFactor = 0.75 + (dim / 1024) * 0.9;
  const totalHeight = (layers - 1) * layerSpacing;

  useFrame((_, delta) => {
    if (stackRef.current) {
      stackRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={stackRef}>
      {/* Base Token Embedding Pedestal */}
      <group position={[0, -totalHeight / 2 - 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[widthFactor * 1.25, widthFactor * 1.35, 0.16, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[widthFactor * 0.9, widthFactor * 1.2, 32]} />
          <meshBasicMaterial color="#2dd4bf" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Stacked Transformer Blocks */}
      {Array.from({ length: layers }).map((_, i) => (
        <TransformerBlock3D
          key={`tf-block-${i}-${layers}-${dim}-${heads}`}
          layerIndex={i}
          totalLayers={layers}
          dim={dim}
          heads={heads}
          attnType={attnType}
          actType={actType}
          layerSpacing={layerSpacing}
        />
      ))}

      {/* Top Unembedding & Logits Head */}
      <group position={[0, totalHeight / 2 + 0.45, 0]}>
        <mesh>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={2.8}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.32, 24]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Residual Bypass Streams */}
      <ResidualStreamParticles
        layerCount={layers}
        layerSpacing={layerSpacing}
        stackRadius={widthFactor * 1.05}
      />
    </group>
  );
}

// ============================================================================
// 3. Interactive Multi-Objective Pareto Frontier Chart (Canvas)
// ============================================================================

function ParetoFrontierCanvas({
  currentPoint,
  evaluatedArchs,
  onSelectArch
}: {
  currentPoint: ArchPoint;
  evaluatedArchs: ArchPoint[];
  onSelectArch: (p: ArchPoint) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute Pareto Frontier
  const paretoPoints = useMemo(() => {
    return evaluatedArchs
      .filter((p) => p.isPareto)
      .sort((a, b) => a.flopsGiga - b.flopsGiga);
  }, [evaluatedArchs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Deep sci-fi backdrop
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    const PAD_LEFT = 52;
    const PAD_RIGHT = 24;
    const PAD_TOP = 24;
    const PAD_BOTTOM = 42;

    const minFlops = 1.0;
    const maxFlops = 50.0;
    const minLoss = 1.1;
    const maxLoss = 3.6;

    const toPxX = (f: number) => PAD_LEFT + ((f - minFlops) / (maxFlops - minFlops)) * (W - PAD_LEFT - PAD_RIGHT);
    const toPxY = (l: number) => H - PAD_BOTTOM - ((l - minLoss) / (maxLoss - minLoss)) * (H - PAD_TOP - PAD_BOTTOM);

    // Subtle Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let f = 10; f <= 50; f += 10) {
      ctx.beginPath();
      ctx.moveTo(toPxX(f), PAD_TOP);
      ctx.lineTo(toPxX(f), H - PAD_BOTTOM);
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${f}G`, toPxX(f), H - PAD_BOTTOM + 16);
    }

    for (let l = 1.5; l <= 3.5; l += 0.5) {
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, toPxY(l));
      ctx.lineTo(W - PAD_RIGHT, toPxY(l));
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(l.toFixed(1), PAD_LEFT - 8, toPxY(l) + 3);
    }

    // Shaded Area Under Pareto Frontier Curve
    if (paretoPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(paretoPoints[0].flopsGiga), toPxY(paretoPoints[0].valLoss));
      paretoPoints.forEach((p) => {
        ctx.lineTo(toPxX(p.flopsGiga), toPxY(p.valLoss));
      });
      ctx.lineTo(toPxX(paretoPoints[paretoPoints.length - 1].flopsGiga), H - PAD_BOTTOM);
      ctx.lineTo(toPxX(paretoPoints[0].flopsGiga), H - PAD_BOTTOM);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, PAD_TOP, 0, H - PAD_BOTTOM);
      grad.addColorStop(0, "rgba(16, 185, 129, 0.18)");
      grad.addColorStop(1, "rgba(16, 185, 129, 0.01)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Glowing Pareto Boundary Line
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(toPxX(paretoPoints[0].flopsGiga), toPxY(paretoPoints[0].valLoss));
      paretoPoints.forEach((p) => {
        ctx.lineTo(toPxX(p.flopsGiga), toPxY(p.valLoss));
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Evaluated Sample Points
    evaluatedArchs.forEach((pt) => {
      const px = toPxX(pt.flopsGiga);
      const py = toPxY(pt.valLoss);

      if (pt.isPareto) {
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Current Selected Architecture Crosshairs & Halo
    const curPx = toPxX(currentPoint.flopsGiga);
    const curPy = toPxY(currentPoint.valLoss);

    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curPx, PAD_TOP);
    ctx.lineTo(curPx, H - PAD_BOTTOM);
    ctx.moveTo(PAD_LEFT, curPy);
    ctx.lineTo(W - PAD_RIGHT, curPy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing Pulse Ring for Current Selection
    ctx.fillStyle = "#a855f7";
    ctx.shadowColor = "#c084fc";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(curPx, curPy, 6.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(curPx, curPy, 8.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Axis Titles
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Computational Cost (GFLOPs / Forward Pass) →", (W + PAD_LEFT) / 2, H - 10);

    ctx.save();
    ctx.translate(16, (H + PAD_TOP - PAD_BOTTOM) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Validation Loss (Lower is Better) →", 0, 0);
    ctx.restore();
  }, [currentPoint, evaluatedArchs, paretoPoints]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
        <span className="flex items-center gap-1.5 text-purple-300">
          <BarChart2 className="h-3.5 w-3.5" />
          Pareto Frontier: Accuracy vs Compute
        </span>
        <div className="flex items-center gap-3 font-mono text-[0.68rem]">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pareto Optimal
          </span>
          <span className="text-purple-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            Active Design
          </span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="button"
          aria-label="Pareto frontier architecture picker"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              // Select first Pareto optimal architecture
              const paretoFirst = evaluatedArchs.find((p) => p.isPareto);
              if (paretoFirst) {
                onSelectArch(paretoFirst);
              }
            }
          }}
          className="w-full h-auto block cursor-crosshair focus:outline-none focus:ring-1 focus:ring-sky-400"
          onClick={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
            const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

            const PAD_LEFT = 52;
            const PAD_RIGHT = 24;
            const PAD_TOP = 24;
            const PAD_BOTTOM = 42;

            // Find closest evaluated arch
            let closest: ArchPoint | null = null;
            let minDist = Infinity;
            evaluatedArchs.forEach((pt) => {
              const px = PAD_LEFT + ((pt.flopsGiga - 1.0) / 49.0) * (canvas.width - PAD_LEFT - PAD_RIGHT);
              const py = canvas.height - PAD_BOTTOM - ((pt.valLoss - 1.1) / 2.5) * (canvas.height - PAD_TOP - PAD_BOTTOM);
              const dist = Math.hypot(clickX - px, clickY - py);
              if (dist < minDist && dist < 24) {
                minDist = dist;
                closest = pt;
              }
            });
            if (closest) onSelectArch(closest);
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// 4. Main Component: Reimagined Neural Architecture Search Lab
// ============================================================================

export function TransformerViz() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { rootMargin: "250px 0px 250px 0px" });

  // Continuous Latent Hyperparameter Coordinates [0, 1]
  const [zLayers, setZLayers] = useState(0.45); // Maps to 2..16 layers
  const [zDim, setZDim] = useState(0.48); // Maps to 128..1024 d_model
  const [zHeads, setZHeads] = useState(0.4); // Maps to 2..16 heads
  const [attnType, setAttnType] = useState<AttentionType>("GQA");
  const [actType, setActType] = useState<ActivationType>("SwiGLU");

  const [isSearching, setIsSearching] = useState(false);
  const [generation, setGeneration] = useState(0);

  // Decode continuous z into physical model parameters
  const currentArch: ArchPoint = useMemo(() => {
    const layers = Math.max(2, Math.min(16, Math.round(2 + zLayers * 14)));
    const dim = Math.max(128, Math.min(1024, Math.round(128 + zDim * 896)));
    const heads = Math.max(2, Math.min(16, Math.round(2 + zHeads * 14)));

    // Exact parameter scaling formula:
    // Params = Embeddings (Vocab*d) + Layers * [ 4*d^2 (Attn) + 2*d*d_ff (MLP) + LayerNorms ]
    const vocab = 32000;
    const dFF = actType === "SwiGLU" ? Math.round((8 / 3) * dim) : 4 * dim;
    const attnParamsPerLayer = attnType === "MHA" ? 4 * dim * dim : attnType === "GQA" ? 2.5 * dim * dim : 2 * dim * dim;
    const mlpParamsPerLayer = actType === "SwiGLU" ? 3 * dim * dFF : 2 * dim * dFF;
    const totalParams = vocab * dim + layers * (attnParamsPerLayer + mlpParamsPerLayer + 4 * dim);
    const paramsM = totalParams / 1e6;

    // GFLOPs per token forward pass
    const flopsGiga = (2 * totalParams) / 1e9 * 2048 / 100; // Normalized forward pass batch cost
    const valLoss = Math.max(
      1.15,
      1.25 + 2.8 / Math.sqrt(layers * 0.6 + (dim / 128) * 1.8) + (attnType === "MQA" ? 0.08 : 0) + (actType === "GELU" ? 0.08 : actType === "Mish" ? 0.04 : 0)
    );
    const latencyMs = (layers * 0.8) + (dim / 256) * 1.2;

    return {
      id: 0,
      layers,
      dim,
      heads,
      attnType,
      actType,
      paramsM,
      flopsGiga: Math.max(1.5, Math.min(48, flopsGiga)),
      valLoss,
      latencyMs,
      isPareto: false
    };
  }, [zLayers, zDim, zHeads, attnType, actType]);

  // Initial synthetic evaluated database
  const [archHistory, setArchHistory] = useState<ArchPoint[]>(() => {
    const list: ArchPoint[] = [];
    for (let i = 0; i < 45; i++) {
      const s1 = Math.sin(i * 13.37 + 1.23);
      const s2 = Math.cos(i * 42.19 + 4.56);
      const s3 = Math.sin(i * 99.81 + 7.89);

      const zl = Math.abs(s1);
      const zd = Math.abs(s2);
      const zh = Math.abs(s3);

      const l = Math.max(2, Math.round(2 + zl * 14));
      const d = Math.max(128, Math.round(128 + zd * 896));
      const h = Math.max(2, Math.round(2 + zh * 14));
      const at: AttentionType = i % 3 === 0 ? "MHA" : i % 3 === 1 ? "GQA" : "MQA";
      const ac: ActivationType = i % 2 === 0 ? "SwiGLU" : "GELU";

      const fl = Math.max(2, Math.min(48, ((l * d * d * 14) / 1e5)));
      const ls = Math.max(1.18, 1.25 + 2.8 / Math.sqrt(l * 0.6 + (d / 128) * 1.8) + (s1 * 0.04));

      list.push({
        id: i + 1,
        layers: l,
        dim: d,
        heads: h,
        attnType: at,
        actType: ac,
        paramsM: (l * d * d * 12) / 1e6,
        flopsGiga: fl,
        valLoss: ls,
        latencyMs: l * 0.9,
        isPareto: false
      });
    }

    // Mark initial Pareto frontier
    list.forEach((p1) => {
      p1.isPareto = !list.some(
        (p2) => p2.flopsGiga <= p1.flopsGiga && p2.valLoss <= p1.valLoss && (p2.flopsGiga < p1.flopsGiga || p2.valLoss < p1.valLoss)
      );
    });
    return list;
  });

  const searchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
    };
  }, []);

  // Multi-Objective CMA-ES Search Execution
  const handleToggleSearch = useCallback(() => {
    if (isSearching) {
      if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setGeneration(0);

    // Multi-objective scalarizer: f(z) = ValLoss + 0.035 * GFLOPs
    const optimizer = new CMAESOptimizer(
      (zl, zd) => {
        const l = Math.max(2, Math.round(2 + zl * 14));
        const d = Math.max(128, Math.round(128 + zd * 896));
        const fl = Math.max(2, (l * d * d * 14) / 1e5);
        const ls = 1.25 + 2.8 / Math.sqrt(l * 0.6 + (d / 128) * 1.8);
        return ls + 0.035 * fl;
      },
      {
        dim: 2,
        initialMean: [zLayers, zDim],
        initialSigma: 0.22,
        lambda: 12,
        bounds: [0.05, 0.95]
      }
    );

    let g = 0;
    const maxG = 25;
    if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);

    searchIntervalRef.current = setInterval(() => {
      g++;
      const state = optimizer.step();
      const nextZL = Math.max(0.05, Math.min(0.95, state.bestX[0]));
      const nextZD = Math.max(0.05, Math.min(0.95, state.bestX[1]));

      setZLayers(nextZL);
      setZDim(nextZD);
      setGeneration(g);

      // Evaluate new batch and update Pareto frontier
      const l = Math.max(2, Math.round(2 + nextZL * 14));
      const d = Math.max(128, Math.round(128 + nextZD * 896));
      const fl = Math.max(2, (l * d * d * 14) / 1e5);
      const ls = 1.25 + 2.8 / Math.sqrt(l * 0.6 + (d / 128) * 1.8);

      setArchHistory((prev) => {
        const next: ArchPoint[] = [
          ...prev,
          {
            id: prev.length + 1,
            layers: l,
            dim: d,
            heads: Math.max(2, Math.round(2 + zHeads * 14)),
            attnType,
            actType,
            paramsM: (l * d * d * 12) / 1e6,
            flopsGiga: fl,
            valLoss: ls,
            latencyMs: l * 0.9,
            isPareto: false,
            generation: g
          }
        ];

        next.forEach((p1) => {
          p1.isPareto = !next.some(
            (p2) => p2.flopsGiga <= p1.flopsGiga && p2.valLoss <= p1.valLoss && (p2.flopsGiga < p1.flopsGiga || p2.valLoss < p1.valLoss)
          );
        });
        return next;
      });

      if (g >= maxG) {
        if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
        setIsSearching(false);
      }
    }, 180);
  }, [isSearching, zLayers, zDim, zHeads, attnType, actType]);

  // Preset Architecture Selectors
  const applyPreset = (preset: "edge" | "balanced" | "scale") => {
    setIsSearching(false);
    if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
    if (preset === "edge") {
      setZLayers(0.18); // 4 Layers
      setZDim(0.25); // 352 Dim
      setZHeads(0.2); // 4 Heads
      setAttnType("MQA");
      setActType("SwiGLU");
    } else if (preset === "balanced") {
      setZLayers(0.48); // 8 Layers
      setZDim(0.55); // 620 Dim
      setZHeads(0.45); // 8 Heads
      setAttnType("GQA");
      setActType("SwiGLU");
    } else {
      setZLayers(0.88); // 14 Layers
      setZDim(0.85); // 890 Dim
      setZHeads(0.85); // 14 Heads
      setAttnType("MHA");
      setActType("SwiGLU");
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-8 border-white/10">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
              <span>Holographic Neural Architecture Search (NAS)</span>
              <span className="text-[0.65rem] font-mono px-2.5 py-0.5 rounded-full border bg-purple-500/15 border-purple-500/40 text-purple-300">
                Mixed Discrete-Continuous
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Discover compute-optimal Transformer Pareto frontiers using covariance adaptation in latent continuous hypercubes
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => applyPreset("edge")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Edge Mobile
          </button>
          <button
            onClick={() => applyPreset("balanced")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Balanced 7B
          </button>
          <button
            onClick={() => applyPreset("scale")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            High-Capacity
          </button>
        </div>
      </div>

      {/* Main Dual Stage */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] items-start">
        {/* Left Column: 3D Holographic Stage */}
        <div className="space-y-3">
          <div
            ref={containerRef}
            className="relative aspect-square sm:aspect-[16/11] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#030014] shadow-[0_20px_60px_rgba(0,0,0,0.8)] group"
          >
            {/* Holographic Vignette */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(3,0,20,0.85)] z-10" />

            <Canvas
              dpr={[1, 2]}
              events={safePointerEvents}
              frameloop={isInView ? "always" : "never"}
            >
              <PerspectiveCamera makeDefault position={[4.6, 2.8, 4.8]} fov={38} />
              <color attach="background" args={["#030014"]} />
              <fog attach="fog" args={["#030014", 8, 22]} />

              <ambientLight intensity={0.4} />
              <pointLight position={[5, 8, 5]} intensity={1.8} color="#38bdf8" />
              <pointLight position={[-5, -4, -5]} intensity={1.0} color="#a855f7" />

              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.06}
                minDistance={3.2}
                maxDistance={14}
                maxPolarAngle={Math.PI / 2 + 0.05}
                target={[0, 0, 0]}
              />

              <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.15}>
                <HolographicTransformerStack
                  layers={currentArch.layers}
                  dim={currentArch.dim}
                  heads={currentArch.heads}
                  attnType={currentArch.attnType}
                  actType={currentArch.actType}
                />
              </Float>

              {/* Cybernetic Coordinate Grid */}
              <gridHelper position={[0, -2.4, 0]} args={[16, 16, "#1e1b4b", "#09051c"]} />
            </Canvas>

            {/* Top-Right Orbit Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span>3D Orbit Active</span>
            </div>

            {/* Bottom-Left Live Architecture Telemetry HUD */}
            <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono text-slate-200 shadow-2xl pointer-events-none">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm font-display">
                <BrainCircuit className="h-4 w-4 text-purple-400" />
                <span>{currentArch.layers} Layers • {currentArch.dim} <LatexRenderer math="d_{\text{model}}" block={false} /> • {currentArch.heads} Heads</span>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem] text-slate-400 pt-1 border-t border-white/10">
                <span>Attn: <strong className="text-sky-300">{currentArch.attnType}</strong></span>
                <span>MLP: <strong className="text-purple-300">{currentArch.actType}</strong></span>
                <span>Params: <strong className="text-emerald-300">{currentArch.paramsM.toFixed(1)}M</strong></span>
              </div>
            </div>

            {/* Live Search Status Pill */}
            {isSearching && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-500/50 shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-purple-200">
                  CMA-ES Optimizing: Gen {generation}/25
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-2 text-[0.72rem] text-slate-400 font-mono">
            <span>Rotary Positional Embeddings • RMSNorm • Residual Highways</span>
            <span className="text-sky-400">~{currentArch.latencyMs.toFixed(1)}ms / token</span>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Pareto Frontier */}
        <div className="space-y-6">
          {/* Sliders Console */}
          <div className="bg-slate-950/50 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-purple-400" />
                <span>Architecture Hyperparameters</span>
              </span>
              <span className="font-mono text-slate-500 text-[0.7rem]">Continuous Knobs</span>
            </div>

            {/* Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Layer Depth (</span><LatexRenderer math="L" block={false} /><span>)</span>
                </span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {currentArch.layers} Layers
                </span>
              </div>
              <input
                type="range"
                aria-label="Layer Depth"
                min={0.0}
                max={1.0}
                step={0.02}
                value={zLayers}
                onChange={(e) => setZLayers(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Width */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Hidden Dimension (</span><LatexRenderer math="d_{\text{model}}" block={false} /><span>)</span>
                </span>
                <span className="text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {currentArch.dim} Channels
                </span>
              </div>
              <input
                type="range"
                aria-label="Hidden Width"
                min={0.0}
                max={1.0}
                step={0.02}
                value={zDim}
                onChange={(e) => setZDim(parseFloat(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>

            {/* Attention Heads */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Attention Heads (</span><LatexRenderer math="n_{\text{heads}}" block={false} /><span>)</span>
                </span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {currentArch.heads} Heads
                </span>
              </div>
              <input
                type="range"
                aria-label="Attention Heads"
                min={0.0}
                max={1.0}
                step={0.02}
                value={zHeads}
                onChange={(e) => setZHeads(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Discrete KV-Cache Paradigm & Activation Selector */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <span className="text-[0.68rem] text-slate-400 uppercase font-mono block mb-1.5">Attention Style</span>
                <div className="grid grid-cols-3 gap-1">
                  {(["MHA", "GQA", "MQA"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAttnType(t)}
                      className={`py-1 text-[0.7rem] font-bold rounded-lg transition-all ${
                        attnType === t
                          ? "bg-sky-500 text-white shadow-glow-sm"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[0.68rem] text-slate-400 uppercase font-mono block mb-1.5">Activation</span>
                <div className="grid grid-cols-3 gap-1">
                  {(["SwiGLU", "GELU", "Mish"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setActType(a)}
                      className={`py-1 text-[0.7rem] font-bold rounded-lg transition-all ${
                        actType === a
                          ? "bg-purple-500 text-white shadow-glow-sm"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pareto Frontier Canvas Visualizer */}
          <ParetoFrontierCanvas
            currentPoint={currentArch}
            evaluatedArchs={archHistory}
            onSelectArch={(p) => {
              setZLayers((p.layers - 2) / 14);
              setZDim((p.dim - 128) / 896);
              setZHeads((p.heads - 2) / 14);
              setAttnType(p.attnType);
              setActType(p.actType);
            }}
          />

          {/* Run Live CMA-ES Auto-Search Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSearch}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs font-bold text-white transition-all shadow-xl ${
                isSearching
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                  : "bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 hover:opacity-95 shadow-purple-500/30 hover:scale-[1.01]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSearching ? "Halt NAS Evolution" : "Run Multi-Objective CMA-ES Architecture Search"}</span>
            </button>

            <button
              onClick={() => {
                setIsSearching(false);
                if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
                setZLayers(0.45);
                setZDim(0.48);
                setZHeads(0.4);
              }}
              className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Architecture"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

