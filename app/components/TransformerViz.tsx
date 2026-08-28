"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useInView } from "../hooks/useScrollSpy";
import {
  Sparkles,
  BrainCircuit,
  BarChart2,
  Compass,
  RotateCcw,
  Sliders,
  Maximize2,
  Minimize2,
  Info,
  TrendingDown
} from "lucide-react";
import { CMAESOptimizerND, CMAESGenerationStateND } from "../lib/cmaesEngineND";
import {
  ArchPoint,
  AttentionType,
  ActivationType,
  decodeVectorToArch,
  evaluateArchFitness
} from "../lib/nasObjective";
import { CMAESPhaseSpaceViewer, CMAESTelemetryHUD } from "./CMAESPhaseSpaceViewer";
import { LatexRenderer } from "./LatexRenderer";

// ============================================================================
// 1. Types & Architectural Models — the surrogate objective itself lives in
// app/lib/nasObjective.ts (view components export only components).
// ============================================================================

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
  const count = 36;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const totalHeight = (layerCount - 1) * layerSpacing + 0.8;
  const startY = -totalHeight / 2;

  const particleData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.35 + (i % 4) * 0.1;
      const offset = i / count;
      const radiusOffset = ((i % 3) - 1) * 0.06;
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

      const currentAngle = p.angle + progress * Math.PI * 0.6;
      const r = stackRadius + 0.28 + p.radiusOffset;
      const x = Math.cos(currentAngle) * r;
      const z = Math.sin(currentAngle) * r;

      dummy.position.set(x, y, z);
      const scale = 0.035 + Math.sin(progress * Math.PI) * 0.03;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      tempColor.setHSL(0.52 + progress * 0.28, 0.95, 0.65);
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 10, 10]} />
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
  yPos,
  scale = 1.0
}: {
  headCount: number;
  attnType: AttentionType;
  radius: number;
  yPos: number;
  scale?: number;
}) {
  const heads = useMemo(() => {
    const arr = [];
    const count = Math.min(headCount, 12);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * (radius * 0.78);
      const z = Math.sin(angle) * (radius * 0.78);
      const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)];
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
        <torusGeometry args={[radius * 0.78, 0.015 * scale, 10, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>

      {/* Individual Attention Head Nodes */}
      {heads.map((h, idx) => (
        <group key={`head-${idx}-${h.x.toFixed(2)}`} position={[h.x, 0, h.z]}>
          <mesh>
            <sphereGeometry args={[0.06 * scale, 12, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={2.2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Subtle Projection Spoke */}
          <line>
            <bufferGeometry setFromPoints={h.linePoints} />
            <lineBasicMaterial color={color} transparent opacity={0.3} />
          </line>
        </group>
      ))}

      {/* Core Attention Projection Hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.09 * scale, 0.09 * scale, 0.06 * scale, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

/**
 * Single Non-Clipping Holographic Transformer Block in 3D
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
  const yCenter = layerIndex * layerSpacing - totalHeight / 2;

  // Normalized width factor [0.7 to 1.5]
  const widthFactor = 0.65 + (dim / 1024) * 0.75;
  const blockScale = Math.min(1.0, layerSpacing / 0.85);

  return (
    <group position={[0, yCenter, 0]}>
      {/* 1. Input RMSNorm Ring */}
      <mesh position={[0, -0.16 * blockScale, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[widthFactor * 0.72, 0.015 * blockScale, 10, 32]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#0d9488" emissiveIntensity={1.8} />
      </mesh>

      {/* 2. Multi-Head Attention Mechanism */}
      <AttentionHeadCluster
        headCount={heads}
        attnType={attnType}
        radius={widthFactor * 0.75}
        yPos={-0.05 * blockScale}
        scale={blockScale}
      />

      {/* 3. Mid-layer RMSNorm Ring */}
      <mesh position={[0, 0.06 * blockScale, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[widthFactor * 0.72, 0.015 * blockScale, 10, 32]} />
        <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={1.8} />
      </mesh>

      {/* 4. SwiGLU / MLP Feed-Forward Core (Hexagonal Prism) */}
      <mesh position={[0, 0.16 * blockScale, 0]}>
        <cylinderGeometry
          args={[
            widthFactor * 0.55,
            widthFactor * 0.62,
            0.11 * blockScale,
            6
          ]}
        />
        <meshPhysicalMaterial
          color="#c084fc"
          emissive="#7e22ce"
          emissiveIntensity={1.2}
          transmission={0.65}
          roughness={0.2}
          thickness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer Neon Layer Bounding Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[widthFactor * 0.88, widthFactor * 0.90, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} />
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
  const layerSpacing = Math.max(0.55, Math.min(1.0, 3.8 / Math.max(2, layers)));
  const widthFactor = 0.65 + (dim / 1024) * 0.75;
  const totalHeight = (layers - 1) * layerSpacing;

  useFrame((_, delta) => {
    if (stackRef.current) {
      stackRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={stackRef}>
      {/* Base Token Embedding Pedestal */}
      <group position={[0, -totalHeight / 2 - 0.4, 0]}>
        <mesh>
          <cylinderGeometry args={[widthFactor * 1.05, widthFactor * 1.15, 0.14, 32]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[widthFactor * 0.75, widthFactor * 1.0, 32]} />
          <meshBasicMaterial color="#2dd4bf" transparent opacity={0.55} side={THREE.DoubleSide} />
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
      <group position={[0, totalHeight / 2 + 0.38, 0]}>
        <mesh>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 24]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Residual Bypass Streams */}
      <ResidualStreamParticles
        layerCount={layers}
        layerSpacing={layerSpacing}
        stackRadius={widthFactor * 0.92}
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
  const [hoveredPoint, setHoveredPoint] = useState<ArchPoint | null>(null);

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

    // Dark sleek background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    const PAD_LEFT = 70;
    const PAD_RIGHT = 30;
    const PAD_TOP = 28;
    const PAD_BOTTOM = 54;

    // True 2NT GFLOPs for these architectures span roughly 18-960 G
    const minFlops = 0.0;
    const maxFlops = 1000.0;
    const minLoss = 1.0;
    const maxLoss = 3.6;

    const toPxX = (f: number) => PAD_LEFT + ((f - minFlops) / (maxFlops - minFlops)) * (W - PAD_LEFT - PAD_RIGHT);
    const toPxY = (l: number) => H - PAD_BOTTOM - ((l - minLoss) / (maxLoss - minLoss)) * (H - PAD_TOP - PAD_BOTTOM);

    // Subtle Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1.0;
    for (let f = 200; f <= 1000; f += 200) {
      ctx.beginPath();
      ctx.moveTo(toPxX(f), PAD_TOP);
      ctx.lineTo(toPxX(f), H - PAD_BOTTOM);
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.65)";
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${f}G`, toPxX(f), H - PAD_BOTTOM + 18);
    }

    for (let l = 1.5; l <= 3.5; l += 0.5) {
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, toPxY(l));
      ctx.lineTo(W - PAD_RIGHT, toPxY(l));
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.65)";
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(l.toFixed(1), PAD_LEFT - 10, toPxY(l) + 4);
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

      // Glowing Line
      ctx.beginPath();
      ctx.moveTo(toPxX(paretoPoints[0].flopsGiga), toPxY(paretoPoints[0].valLoss));
      paretoPoints.forEach((p) => {
        ctx.lineTo(toPxX(p.flopsGiga), toPxY(p.valLoss));
      });
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Evaluated Samples (Scatter points)
    evaluatedArchs.forEach((p) => {
      const px = toPxX(p.flopsGiga);
      const py = toPxY(p.valLoss);

      if (p.isPareto) {
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 7.5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Active Design Crosshair & Glow Ring
    const curPx = toPxX(currentPoint.flopsGiga);
    const curPy = toPxY(currentPoint.valLoss);

    ctx.strokeStyle = "rgba(192, 132, 252, 0.4)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curPx, PAD_TOP);
    ctx.lineTo(curPx, H - PAD_BOTTOM);
    ctx.moveTo(PAD_LEFT, curPy);
    ctx.lineTo(W - PAD_RIGHT, curPy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(curPx, curPy, 6.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(curPx, curPy, 9.5, 0, Math.PI * 2);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Forward Pass Compute (GFLOPs) →", (W + PAD_LEFT) / 2, H - 12);

    ctx.save();
    ctx.translate(18, (H + PAD_TOP - PAD_BOTTOM) / 2);
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem]">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pareto Optimal ({paretoPoints.length})
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
          width={760}
          height={380}
          tabIndex={0}
          role="button"
          aria-label="Pareto frontier architecture picker"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              const paretoFirst = evaluatedArchs.find((p) => p.isPareto);
              if (paretoFirst) onSelectArch(paretoFirst);
            }
          }}
          onMouseMove={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
            const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

            const PAD_LEFT = 70;
            const PAD_RIGHT = 30;
            const PAD_TOP = 28;
            const PAD_BOTTOM = 54;

            let closest: ArchPoint | null = null;
            let minDist = Infinity;
            evaluatedArchs.forEach((pt) => {
              const px = PAD_LEFT + ((pt.flopsGiga - 1.0) / 49.0) * (canvas.width - PAD_LEFT - PAD_RIGHT);
              const py = canvas.height - PAD_BOTTOM - ((pt.valLoss - 1.0) / 2.6) * (canvas.height - PAD_TOP - PAD_BOTTOM);
              const dist = Math.hypot(clickX - px, clickY - py);
              if (dist < minDist && dist < 32) {
                minDist = dist;
                closest = pt;
              }
            });
            setHoveredPoint(closest);
          }}
          onMouseLeave={() => setHoveredPoint(null)}
          onClick={() => {
            if (hoveredPoint) onSelectArch(hoveredPoint);
          }}
          className="w-full h-auto block cursor-crosshair focus:outline-none focus:ring-1 focus:ring-purple-400"
        />

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-950/90 border border-purple-500/40 backdrop-blur-md text-[0.7rem] font-mono text-slate-200 shadow-xl pointer-events-none space-y-1">
            <div className="font-bold text-purple-300">
              {hoveredPoint.layers}L • {hoveredPoint.dim}d • {hoveredPoint.heads}H ({hoveredPoint.attnType})
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Params: <strong className="text-emerald-300">{hoveredPoint.paramsM.toFixed(1)}M</strong></span>
              <span>Loss: <strong className="text-sky-300">{hoveredPoint.valLoss.toFixed(3)}</strong></span>
              <span>Compute: <strong className="text-amber-300">{hoveredPoint.flopsGiga.toFixed(1)}G</strong></span>
            </div>
          </div>
        )}
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
  // GL mount gate: release the WebGL context entirely when far offscreen
  // (600px margin supersedes the 250px frameloop margin; keeps only
  // near-viewport scenes alive — see WingViz for the full rationale).
  const shouldMountGL = useInView(containerRef, { rootMargin: "600px 0px 600px 0px" });

  // 5D Hyperparameter Vector z in [0, 1]^5: [Layers, Dim, Heads, Attn, Act]
  const [paramVector, setParamVector] = useState<number[]>([0.45, 0.48, 0.4, 0.5, 0.2]);
  const [isSearching, setIsSearching] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [isExpanded3D, setIsExpanded3D] = useState(false);

  // Live CMA-ES Internal Telemetry State
  const [latestStateND, setLatestStateND] = useState<CMAESGenerationStateND | null>(null);
  const [historyND, setHistoryND] = useState<CMAESGenerationStateND[]>([]);

  // Decode current architecture
  const currentArch: ArchPoint = useMemo(() => {
    return decodeVectorToArch(paramVector);
  }, [paramVector]);

  // Initial synthetic database of evaluated candidate architectures
  const [archHistory, setArchHistory] = useState<ArchPoint[]>(() => {
    const list: ArchPoint[] = [];
    for (let i = 0; i < 40; i++) {
      const s1 = Math.abs(Math.sin(i * 13.37 + 1.23));
      const s2 = Math.abs(Math.cos(i * 42.19 + 4.56));
      const s3 = Math.abs(Math.sin(i * 99.81 + 7.89));
      const s4 = (i % 3) * 0.35;
      const s5 = (i % 3) * 0.35;

      const arch = decodeVectorToArch([s1, s2, s3, s4, s5]);
      arch.id = i + 1;
      list.push(arch);
    }

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

  // Multi-Objective 5D CMA-ES Search Execution
  const handleToggleSearch = useCallback(() => {
    if (isSearching) {
      if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setGeneration(0);
    setLatestStateND(null);
    setHistoryND([]);

    const optimizer = new CMAESOptimizerND(
      (zVec) => evaluateArchFitness(zVec),
      {
        dim: 5,
        initialMean: [...paramVector],
        initialSigma: 0.22,
        lambda: 14,
        bounds: [0.0, 1.0]
      }
    );

    let g = 0;
    const maxG = 25;
    if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);

    searchIntervalRef.current = setInterval(() => {
      g++;
      const state = optimizer.step();
      setParamVector([...(g >= maxG ? state.bestX : state.mean)]);
      setGeneration(g);
      setLatestStateND(state);
      setHistoryND((prev) => [...prev, state]);

      const candidateArchitectures = state.samples.map((sample) => {
        const architecture = decodeVectorToArch(sample.x);
        architecture.id = g * 1000 + sample.id;
        architecture.generation = g;
        return architecture;
      });

      setArchHistory((prev) => {
        const next = [...prev, ...candidateArchitectures];
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
  }, [isSearching, paramVector]);

  // Preset Architecture Selectors
  const applyPreset = (preset: "edge" | "balanced" | "scale") => {
    setIsSearching(false);
    if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
    setGeneration(0);
    setLatestStateND(null);
    setHistoryND([]);
    if (preset === "edge") {
      setParamVector([0.18, 0.25, 0.2, 0.8, 0.1]); // 5 Layers, 352 Dim, 5 Heads, MQA, SwiGLU
    } else if (preset === "balanced") {
      setParamVector([0.48, 0.55, 0.45, 0.5, 0.1]); // 9 Layers, 621 Dim, 8 Heads, GQA, SwiGLU
    } else {
      setParamVector([0.88, 0.85, 0.85, 0.1, 0.1]); // 14 Layers, 890 Dim, 14 Heads, MHA, SwiGLU
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
            <h3 className="text-xl font-bold text-white font-display flex flex-wrap items-center gap-2.5">
              <span>Holographic Neural Architecture Search (NAS)</span>
              <span className="text-[0.65rem] font-mono px-2.5 py-0.5 rounded-full border bg-purple-500/15 border-purple-500/40 text-purple-300">
                5D Mixed Discrete-Continuous
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              CMA-ES minimizes a weighted loss, compute, and latency objective in a continuous latent space; the chart tracks the empirical Pareto set of every architecture evaluated. Loss and latency come from hand-written surrogates, not training runs.
            </p>
          </div>
        </div>

        {/* Quick Presets (wrap on narrow screens instead of overflowing) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => applyPreset("edge")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-[background-color,color]"
          >
            Edge Mobile
          </button>
          <button
            onClick={() => applyPreset("balanced")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-[background-color,color]"
          >
            Balanced ~60M
          </button>
          <button
            onClick={() => applyPreset("scale")}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-[background-color,color]"
          >
            High-Capacity
          </button>
        </div>
      </div>

      {/* Main Dual Stage */}
      {/* min-w-0 on both columns: Safari propagates the WebGL canvas's
          DPR-scaled intrinsic width through the grid track otherwise,
          inflating the section past the iPhone viewport. */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* Left Column: 3D Holographic Stage (Single or Split 3D View) */}
        <div className="space-y-3 min-w-0">
          {isExpanded3D ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 3D Transformer Model */}
              <div
                ref={containerRef}
                className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl"
              >
                {shouldMountGL && (
                <Canvas
                  dpr={[1, 2]}
                  events={safePointerEvents}
                  frameloop={isInView ? "always" : "demand"}
                >
                  <PerspectiveCamera makeDefault position={[4.2, 2.5, 4.4]} fov={38} />
                  <color attach="background" args={["#030712"]} />
                  <fog attach="fog" args={["#030712", 8, 22]} />

                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 10, 6]} intensity={1.2} />
                  <pointLight position={[-5, 4, -4]} intensity={0.8} color="#38bdf8" />
                  <pointLight position={[4, -4, -4]} intensity={0.8} color="#c084fc" />

                  <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={3.0}
                    maxDistance={12}
                    maxPolarAngle={Math.PI / 2 + 0.05}
                    target={[0, 0, 0]}
                  />

                  <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.1}>
                    <HolographicTransformerStack
                      layers={currentArch.layers}
                      dim={currentArch.dim}
                      heads={currentArch.heads}
                      attnType={currentArch.attnType}
                      actType={currentArch.actType}
                    />
                  </Float>
                </Canvas>
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 text-[0.62rem] font-bold text-purple-300 backdrop-blur-md">
                  3D Transformer Stack
                </div>
              </div>

              {/* 3D PCA Covariance Phase Space Canvas */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#030712]">
                <CMAESPhaseSpaceViewer
                  latestState={latestStateND}
                  history={historyND}
                  title="3D PCA Covariance Ellipsoid"
                />
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="relative aspect-square sm:aspect-[16/11] lg:h-[460px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-[0_20px_60px_rgba(0,0,0,0.8)] group"
            >
              {shouldMountGL && (
              <Canvas
                dpr={[1, 2]}
                events={safePointerEvents}
                frameloop={isInView ? "always" : "demand"}
              >
                <PerspectiveCamera makeDefault position={[4.4, 2.6, 4.6]} fov={38} />
                <color attach="background" args={["#030712"]} />
                <fog attach="fog" args={["#030712", 8, 22]} />

                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 6]} intensity={1.2} />
                <pointLight position={[-5, 4, -4]} intensity={0.8} color="#38bdf8" />
                <pointLight position={[4, -4, -4]} intensity={0.8} color="#c084fc" />

                <OrbitControls
                  makeDefault
                  enableDamping
                  dampingFactor={0.06}
                  minDistance={3.0}
                  maxDistance={14}
                  maxPolarAngle={Math.PI / 2 + 0.05}
                  target={[0, 0, 0]}
                />

                <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.12}>
                  <HolographicTransformerStack
                    layers={currentArch.layers}
                    dim={currentArch.dim}
                    heads={currentArch.heads}
                    attnType={currentArch.attnType}
                    actType={currentArch.actType}
                  />
                </Float>
              </Canvas>
              )}

              {/* Top-Right Orbit Badge */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
                <Compass className="h-3.5 w-3.5 text-purple-400" />
                <span className="sm:hidden">Drag to orbit</span>
                <span className="hidden sm:inline">Drag to orbit 3D architecture</span>
              </div>

              {/* Bottom-Left Live Architecture Telemetry HUD (desktop only:
                  on a phone it blankets the 3D model; mobile shows the same
                  numbers in the strip under the viewport) */}
              <div className="hidden sm:flex absolute bottom-3 left-3 z-20 flex-col gap-1 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono text-slate-200 shadow-2xl pointer-events-none">
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
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 text-[0.72rem] text-slate-400 font-mono">
            <span className="sm:hidden text-slate-200">
              {currentArch.layers}L · {currentArch.dim}d · {currentArch.heads}H · {currentArch.attnType}/{currentArch.actType} ·{" "}
              <span className="text-emerald-300 font-bold">{currentArch.paramsM.toFixed(1)}M params</span>
            </span>
            <span className="hidden sm:inline">Rotary Embeddings • RMSNorm • Residual Streams</span>
            <span className="text-purple-300 font-bold">~{currentArch.latencyMs.toFixed(1)}ms / token (surrogate)</span>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Pareto Frontier */}
        <div className="space-y-6 min-w-0">
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
                value={paramVector[0]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParamVector((prev) => [val, prev[1], prev[2], prev[3], prev[4]]);
                }}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Width */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex flex-wrap items-center gap-1">
                  <span>Hidden Dimension</span>
                  <span className="whitespace-nowrap inline-flex items-center">(<LatexRenderer math="d_{\text{model}}" block={false} />)</span>
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
                value={paramVector[1]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParamVector((prev) => [prev[0], val, prev[2], prev[3], prev[4]]);
                }}
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
                value={paramVector[2]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParamVector((prev) => [prev[0], prev[1], val, prev[3], prev[4]]);
                }}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Discrete KV-Cache Paradigm & Activation Selector */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <span className="text-[0.68rem] text-slate-400 uppercase font-mono block mb-1.5">Attention Style</span>
                <div className="grid grid-cols-3 gap-1">
                  {(["MHA", "GQA", "MQA"] as const).map((t, idx) => {
                    const active = currentArch.attnType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const val = idx === 0 ? 0.15 : idx === 1 ? 0.5 : 0.85;
                          setParamVector((prev) => [prev[0], prev[1], prev[2], val, prev[4]]);
                        }}
                        className={`py-1 text-[0.7rem] font-bold rounded-lg transition-[background-color,color,box-shadow] ${
                          active
                            ? "bg-sky-500 text-white shadow-glow-sm"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[0.68rem] text-slate-400 uppercase font-mono block mb-1.5">Activation</span>
                <div className="grid grid-cols-3 gap-1">
                  {(["SwiGLU", "GELU", "Mish"] as const).map((a, idx) => {
                    const active = currentArch.actType === a;
                    return (
                      <button
                        key={a}
                        onClick={() => {
                          const val = idx === 0 ? 0.15 : idx === 1 ? 0.5 : 0.85;
                          setParamVector((prev) => [prev[0], prev[1], prev[2], prev[3], val]);
                        }}
                        className={`py-1 text-[0.7rem] font-bold rounded-lg transition-[background-color,color,box-shadow] ${
                          active
                            ? "bg-purple-500 text-white shadow-glow-sm"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pareto Frontier Canvas Visualizer */}
          <ParetoFrontierCanvas
            currentPoint={currentArch}
            evaluatedArchs={archHistory}
            onSelectArch={(p) => {
              const zl = (p.layers - 2) / 14;
              const zd = (p.dim - 128) / 896;
              const zh = (p.heads - 2) / 14;
              const zat = p.attnType === "MHA" ? 0.15 : p.attnType === "GQA" ? 0.5 : 0.85;
              const zac = p.actType === "SwiGLU" ? 0.15 : p.actType === "GELU" ? 0.5 : 0.85;
              setParamVector([zl, zd, zh, zat, zac]);
            }}
          />

          {/* Run Live CMA-ES Auto-Search Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSearch}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs font-bold text-white transition-[background-color,box-shadow,transform,opacity] shadow-xl ${
                isSearching
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                  : "bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 hover:opacity-95 shadow-purple-500/30 hover:scale-[1.01]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSearching ? "Halt NAS Evolution" : "Run 5D CMA-ES Architecture Search (weighted-sum objective)"}</span>
            </button>

            <button
              onClick={() => {
                setIsSearching(false);
                if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
                setGeneration(0);
                setLatestStateND(null);
                setHistoryND([]);
                setParamVector([0.45, 0.48, 0.4, 0.5, 0.2]);
              }}
              className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-[background-color,color]"
              title="Reset Architecture"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Unified Live CMA-ES Internal State Telemetry HUD (Directly at the bottom) */}
      <CMAESTelemetryHUD
        latestState={latestStateND}
        history={historyND}
        isOptimizing={isSearching}
        maxGen={25}
        onToggleExpand3D={() => setIsExpanded3D((prev) => !prev)}
        isExpanded3D={isExpanded3D}
        accentColor="purple"
        objectiveName="Loss + Compute + Latency"
      />
    </div>
  );
}
