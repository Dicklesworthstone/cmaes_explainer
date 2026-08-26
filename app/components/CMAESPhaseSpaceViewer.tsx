"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, OrbitControls, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CMAESGenerationStateND } from "../lib/cmaesEngineND";
import { useInView } from "../hooks/useScrollSpy";
import { Activity, Compass, Layers, Sparkles, Navigation, Gauge, TrendingDown, Maximize2, Minimize2 } from "lucide-react";

/**
 * Renders the 3D Covariance Ellipsoid Mesh for the projected distribution N(0, sigma^2 C_3D)
 * with 1-sigma wireframe inner core and 2-sigma translucent confidence envelope.
 */
function EllipsoidMesh({
  radii,
  sigma,
  scaleRef
}: {
  radii: [number, number, number];
  sigma: number;
  scaleRef: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const outerHullRef = useRef<THREE.Mesh>(null);

  const targetScale1Sigma = useMemo(() => new THREE.Vector3(), []);
  const targetScale2Sigma = useMemo(() => new THREE.Vector3(), []);
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(1, 20, 14), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const s = scaleRef.current ?? 3.5;
    targetScale1Sigma.set(
      Math.max(0.06, radii[0] * s),
      Math.max(0.06, radii[1] * s),
      Math.max(0.06, radii[2] * s)
    );
    targetScale2Sigma.set(
      Math.max(0.12, radii[0] * s * 1.8),
      Math.max(0.12, radii[1] * s * 1.8),
      Math.max(0.12, radii[2] * s * 1.8)
    );

    const lerpRate = Math.min(1, delta * 9.0);
    meshRef.current.scale.lerp(targetScale1Sigma, lerpRate);

    if (wireRef.current) {
      wireRef.current.scale.copy(meshRef.current.scale);
    }
    if (outerHullRef.current) {
      outerHullRef.current.scale.lerp(targetScale2Sigma, lerpRate);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1-Sigma Translucent Solid Hull */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transmission={0.7}
          roughness={0.15}
          thickness={0.8}
          transparent
          opacity={0.55}
          emissive="#38bdf8"
          emissiveIntensity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* 1-Sigma Wireframe Lattice */}
      <lineSegments ref={wireRef}>
        <wireframeGeometry args={[sphereGeom]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </lineSegments>

      {/* 2-Sigma Outer Confidence Shell */}
      <mesh ref={outerHullRef}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Renders 3D Principal Axis Vectors (Eigenvector directions)
 */
function PrincipalAxes({
  radii,
  scale = 3.5
}: {
  radii: [number, number, number];
  scale?: number;
}) {
  const rX = Math.max(0.15, radii[0] * scale * 1.4);
  const rY = Math.max(0.15, radii[1] * scale * 1.4);
  const rZ = Math.max(0.15, radii[2] * scale * 1.4);

  const lineX = useMemo(() => [new THREE.Vector3(-rX, 0, 0), new THREE.Vector3(rX, 0, 0)], [rX]);
  const lineY = useMemo(() => [new THREE.Vector3(0, -rY, 0), new THREE.Vector3(0, rY, 0)], [rY]);
  const lineZ = useMemo(() => [new THREE.Vector3(0, 0, -rZ), new THREE.Vector3(0, 0, rZ)], [rZ]);

  return (
    <group position={[0, 0, 0]}>
      {/* PC1 Major Axis (Rose) */}
      <Line points={lineX} color="#f43f5e" lineWidth={3.0} />
      {/* PC2 Minor Axis (Emerald) */}
      <Line points={lineY} color="#34d399" lineWidth={3.0} />
      {/* PC3 Depth Axis (Sky) */}
      <Line points={lineZ} color="#38bdf8" lineWidth={3.0} />
    </group>
  );
}

/**
 * 3D Population Point Cloud with Elites Highlighted
 */
function PopulationCloud({
  state,
  scaleRef
}: {
  state: CMAESGenerationStateND;
  scaleRef: React.RefObject<number>;
}) {
  const instRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const samples = state.samples;
  const count = samples.length;

  useFrame(() => {
    if (!instRef.current) return;
    const sFactor = scaleRef.current ?? 3.5;

    for (let i = 0; i < count; i++) {
      const s = samples[i];
      const p = s.projected3D;
      dummy.position.set(p[0] * sFactor, p[1] * sFactor, p[2] * sFactor);
      dummy.scale.setScalar(s.isElite ? 0.085 : 0.045);
      dummy.updateMatrix();

      if (s.isElite) {
        tempColor.set("#34d399"); // Emerald Elite
      } else {
        tempColor.set("#94a3b8"); // Slate Offspring
      }

      instRef.current.setMatrixAt(i, dummy.matrix);
      instRef.current.setColorAt(i, tempColor);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
    if (instRef.current.instanceColor) instRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instRef} args={[undefined as any, undefined as any, Math.max(1, count)]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
}

/**
 * Evolution Path (p_c and p_sigma) 3D Vectors
 */
function EvolutionPaths({
  pC,
  pSigma,
  scale = 3.5
}: {
  pC: [number, number, number];
  pSigma?: [number, number, number];
  scale?: number;
}) {
  const linePC = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pC[0] * scale * 0.8, pC[1] * scale * 0.8, pC[2] * scale * 0.8)
    ];
  }, [pC, scale]);

  const linePSigma = useMemo(() => {
    if (!pSigma) return [];
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pSigma[0] * scale * 0.8, pSigma[1] * scale * 0.8, pSigma[2] * scale * 0.8)
    ];
  }, [pSigma, scale]);

  return (
    <group position={[0, 0, 0]}>
      {/* Covariance Path p_c (Purple) */}
      <Line points={linePC} color="#c084fc" lineWidth={3.2} />
      {/* Step-size Path p_sigma (Amber) */}
      {linePSigma.length > 0 && (
        <Line points={linePSigma} color="#fbbf24" lineWidth={2.5} dashed dashScale={15} />
      )}
    </group>
  );
}

function DynamicSceneRig({
  radii,
  sigma,
  state,
  pC,
  pSigma
}: {
  radii: [number, number, number];
  sigma: number;
  state: CMAESGenerationStateND;
  pC: [number, number, number];
  pSigma?: [number, number, number];
}) {
  const currentScaleRef = useRef(3.5);
  const targetScaleRef = useRef(3.5);

  // Compute adaptive visual scale so the covariance ellipse is ALWAYS prominent and visible,
  // while faithfully preserving its real aspect ratio and condition number.
  const maxRadius = Math.max(radii[0], radii[1], radii[2], 1e-6);
  // Target comfortable visual extent ~1.6 - 2.0 scene units
  const idealScale = Math.min(160.0, Math.max(2.0, 1.85 / Math.max(maxRadius, 1e-4)));

  useEffect(() => {
    targetScaleRef.current = idealScale;
  }, [idealScale]);

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1.0, delta * 7.0);
    currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * lerpSpeed;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Coordinate Grid Planes */}
      <gridHelper args={[4, 8, "#1e293b", "#0f172a"]} position={[0, -1.2, 0]} />

      {/* Centered Distribution Mean Dot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3D Covariance Ellipsoid */}
      <EllipsoidMesh
        radii={radii}
        sigma={sigma}
        scaleRef={currentScaleRef}
      />

      {/* Principal Axes Vectors */}
      <PrincipalAxes
        radii={radii}
        scale={idealScale}
      />

      {/* Candidate Offspring Population Cloud & Elites */}
      <PopulationCloud
        state={state}
        scaleRef={currentScaleRef}
      />

      {/* Evolution Paths (p_c & p_sigma) */}
      <EvolutionPaths
        pC={pC}
        pSigma={pSigma}
        scale={idealScale}
      />
    </group>
  );
}

export function CMAESPhaseSpaceViewer({
  latestState,
  history,
  className = "",
  title = "Internal CMA-ES 3D PCA Phase-Space Evolution"
}: {
  latestState: CMAESGenerationStateND | null;
  history: CMAESGenerationStateND[];
  className?: string;
  title?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { rootMargin: "250px 0px 250px 0px" });

  if (!latestState) {
    return (
      <div className={`rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center text-xs text-slate-400 ${className}`}>
        Launch optimization to project internal covariance adaptation into 3D phase space.
      </div>
    );
  }

  const { phaseSpace3D, conditionNumber, sigma, generation, pC, pSigma, variancePerDim } = latestState;

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-white/10 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2 font-bold text-white">
          <Layers className="h-4 w-4 text-sky-400" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.68rem] text-slate-300">
          <span className="bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded border border-sky-500/20">
            Gen {generation}
          </span>
          <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
            κ(C) = {conditionNumber.toFixed(1)}
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative aspect-[16/11] w-full">
        <Canvas
          events={safePointerEvents}
          shadows
          dpr={[1, 2]}
          frameloop={isInView ? "always" : "never"}
        >
          <PerspectiveCamera makeDefault position={[2.2, 1.6, 2.8]} fov={40} />
          <color attach="background" args={["#030712"]} />

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-4, -4, -4]} intensity={0.6} color="#38bdf8" />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={1.2}
            maxDistance={8.0}
            target={[0, 0, 0]}
          />

          <DynamicSceneRig
            radii={phaseSpace3D.ellipsoidRadii}
            sigma={sigma}
            state={latestState}
            pC={phaseSpace3D.evolutionPath3D}
            pSigma={phaseSpace3D.evolutionPathSigma3D}
          />
        </Canvas>

        {/* Orbit hint badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[0.65rem] font-mono text-slate-300 pointer-events-none">
          <Compass className="h-3 w-3 text-sky-400" />
          <span>Rotate phase-space</span>
        </div>

        {/* Eigensystem Diagnostics Telemetry Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[0.68rem] font-mono text-slate-300 space-y-1.5 shadow-xl pointer-events-none w-60">
          <div className="text-[0.62rem] uppercase font-bold text-sky-400 tracking-wider flex justify-between">
            <span>PCA Variance Explained</span>
            <span className="text-slate-400 font-normal">Top 3 Components</span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="flex justify-between items-center">
              <span className="text-rose-400">PC 1 (Major Axis):</span>
              <span className="font-bold">{phaseSpace3D.varianceExplainedPercent[0].toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400">PC 2 (Minor Axis):</span>
              <span className="font-bold">{phaseSpace3D.varianceExplainedPercent[1].toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sky-400">PC 3 (Depth Axis):</span>
              <span className="font-bold">{phaseSpace3D.varianceExplainedPercent[2].toFixed(1)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[0.62rem] text-slate-400 pt-1.5 border-t border-white/10">
            <span>Evolution Path <code className="text-purple-300 font-bold font-mono">p_c</code>:</span>
            <span className="text-purple-300 font-bold">Active Momentum</span>
          </div>

          <div className="flex justify-between text-[0.62rem] text-slate-400">
            <span>Step Size <code className="text-amber-300 font-bold font-mono">σ</code>:</span>
            <span className="text-amber-300 font-bold">{sigma.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2D High-Speed Radar displaying the projected covariance ellipse, principal axes,
 * elite samples, and cumulation paths on an aerospace flight-HUD radar grid.
 */
export function CMAESMiniRadar({
  state,
  size = 100,
  className = ""
}: {
  state: CMAESGenerationStateND | null;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // 1. Radar Grid Background
    ctx.fillStyle = "rgba(3, 7, 18, 0.95)";
    ctx.fillRect(0, 0, w, h);

    // Range rings
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.82].forEach((factor) => {
      ctx.beginPath();
      ctx.arc(cx, cy, (w / 2) * factor, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.beginPath();
    ctx.moveTo(cx, 4);
    ctx.lineTo(cx, h - 4);
    ctx.moveTo(4, cy);
    ctx.lineTo(w - 4, cy);
    ctx.stroke();

    const { phaseSpace3D, samples } = state;
    const radii = phaseSpace3D.ellipsoidRadii;
    const maxR = Math.max(radii[0], radii[1], 1e-4);
    const scale = ((w / 2) * 0.72) / maxR;

    const r0 = Math.max(3, radii[0] * scale);
    const r1 = Math.max(3, radii[1] * scale);

    // 2. 2-Sigma Outer Confidence Ellipse (Translucent)
    ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r0 * 1.8, r1 * 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. 1-Sigma Inner Covariance Core
    ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r0, r1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Principal Axes
    ctx.strokeStyle = "#f43f5e"; // PC1 Major Axis (Rose)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - r0, cy);
    ctx.lineTo(cx + r0, cy);
    ctx.stroke();

    ctx.strokeStyle = "#34d399"; // PC2 Minor Axis (Emerald)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r1);
    ctx.lineTo(cx, cy + r1);
    ctx.stroke();

    // 5. Candidate Offspring Samples
    samples.forEach((s) => {
      const px = cx + s.projected3D[0] * scale;
      const py = cy - s.projected3D[1] * scale;
      if (s.isElite) {
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Covariance Path p_c (Purple Vector)
    const pc = phaseSpace3D.evolutionPath3D;
    const pcX = cx + pc[0] * scale * 0.7;
    const pcY = cy - pc[1] * scale * 0.7;
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pcX, pcY);
    ctx.stroke();

    // Arrowhead on p_c
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(pcX, pcY, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 7. Center Mean Point (Glowing White)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [state, size]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-sky-500/20 shadow-inner bg-slate-950/90 ${className}`}>
      <canvas ref={canvasRef} width={size * 2} height={size * 2} className="w-full h-full block" />
      <div className="absolute top-1 left-1.5 text-[0.55rem] font-mono uppercase tracking-wider text-sky-400/80 pointer-events-none">
        C_3D PCA
      </div>
    </div>
  );
}

/**
 * Unified Live Telemetry HUD Bar / Deck.
 * Sits directly below or inside physical simulation viewports (airplane wing, suspension bridge),
 * giving users instantaneous, real-time insight into the internal mathematical dynamics of CMA-ES.
 */
export function CMAESTelemetryHUD({
  latestState,
  history,
  isOptimizing,
  maxGen = 25,
  onToggleExpand3D,
  isExpanded3D = false,
  accentColor = "cyan",
  title = "CMA-ES Internal State",
  objectiveName = "Cost Score"
}: {
  latestState: CMAESGenerationStateND | null;
  history: CMAESGenerationStateND[];
  isOptimizing: boolean;
  maxGen?: number;
  onToggleExpand3D?: () => void;
  isExpanded3D?: boolean;
  accentColor?: "cyan" | "purple" | "emerald" | "amber";
  title?: string;
  objectiveName?: string;
}) {
  // Sparkline calculation
  const sparklineData = useMemo(() => {
    if (history.length === 0) return { path: "", minVal: 0, maxVal: 0, currentVal: 0 };
    const scores = history.map((s) => s.bestFitness);
    const minVal = Math.min(...scores);
    const maxVal = Math.max(...scores);
    const range = Math.max(1e-6, maxVal - minVal);
    const w = 140;
    const h = 34;

    const points = scores.map((val, idx) => {
      const x = (idx / Math.max(1, scores.length - 1)) * (w - 8) + 4;
      const y = h - 4 - ((val - minVal) / range) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      path: `M ${points.join(" L ")}`,
      minVal,
      maxVal,
      currentVal: scores[scores.length - 1]
    };
  }, [history]);

  if (!latestState) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>CMA-ES State: Initializing distribution N(m, σ² C)...</span>
      </div>
    );
  }

  const { generation, sigma, conditionNumber, phaseSpace3D, evalCount, bestFitness } = latestState;
  const initialFitness = history[0]?.bestFitness ?? bestFitness;
  const fitnessDelta = initialFitness > 0 ? ((bestFitness - initialFitness) / initialFitness) * 100 : 0;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden transition-[border-color,box-shadow] duration-300">
      {/* Top Telemetry Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isOptimizing ? "bg-cyan-400 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span className="font-bold text-white uppercase tracking-wider text-[0.68rem]">
              {isOptimizing ? "Optimizing" : "Ready"} · Gen {generation}/{maxGen}
            </span>
          </div>

          <span className="text-slate-500 font-mono">|</span>

          <span className="font-mono text-[0.68rem] text-slate-300">
            <span className="text-slate-400 font-normal">Evaluations:</span>{" "}
            <span className="font-bold text-sky-300">{evalCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[0.68rem]">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-white/10">
            <span className="text-slate-400">{objectiveName}:</span>
            <span className="font-bold text-emerald-300">{bestFitness.toFixed(4)}</span>
            {history.length > 1 && (
              <span
                className={`text-[0.62rem] font-bold ${
                  fitnessDelta < 0 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                ({fitnessDelta > 0 ? "+" : ""}
                {fitnessDelta.toFixed(1)}%)
              </span>
            )}
          </div>

          {onToggleExpand3D && (
            <button
              onClick={onToggleExpand3D}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-medium transition-[background-color,color,border-color,box-shadow] ${
                isExpanded3D
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
              title={isExpanded3D ? "Collapse 3D Phase Space" : "Expand 3D Phase Space Split View"}
            >
              <Layers className="h-3 w-3 text-sky-400" />
              <span>{isExpanded3D ? "Split 3D View (On)" : "3D Phase Space"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Multi-Metric Telemetry Deck */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] lg:grid-cols-[auto_1fr_1fr_140px] gap-3.5 sm:gap-4 items-center">
        {/* Col 1: High-Tech Covariance PCA Radar */}
        <div className="flex items-center gap-3">
          <CMAESMiniRadar state={latestState} size={82} />
          <div className="space-y-1 font-mono text-[0.65rem]">
            <div className="text-slate-400 text-[0.6rem] uppercase tracking-wider font-sans font-semibold text-sky-400">
              Active Search Kernel
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">κ(C):</span>{" "}
              <span className="font-bold text-purple-300">{conditionNumber.toFixed(1)}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">PC1:</span>{" "}
              <span className="font-bold text-rose-300">
                {phaseSpace3D.varianceExplainedPercent[0].toFixed(0)}%
              </span>
            </div>
            <div className="text-[0.6rem] text-slate-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Elites: μ={latestState.samples.filter((s) => s.isElite).length}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Step-Size & Cumulation Memory */}
        <div className="space-y-1.5 font-mono text-xs bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-[0.68rem]">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="h-3 w-3 text-amber-400" />
              <span>Step-Size (σ):</span>
            </span>
            <span className="font-bold text-amber-300">{sigma.toFixed(4)}</span>
          </div>

          {/* Dynamic Step Size Bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-[width] duration-300"
              style={{ width: `${Math.min(100, Math.max(5, (sigma / 0.5) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[0.62rem] text-slate-400 pt-0.5">
            <span>Anisotropy Path <code className="text-purple-300 font-bold">p_c</code></span>
            <span className="text-purple-300 font-bold">Vector Memory</span>
          </div>
        </div>

        {/* Col 3: PCA Variance Decomposition Energy Bars */}
        <div className="space-y-1.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 font-mono text-[0.68rem]">
          <div className="text-[0.6rem] uppercase tracking-wider font-sans font-semibold text-slate-400">
            Top PCA Eigen-Axes
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[0.62rem]">
              <span className="text-rose-400">PC 1 (Major)</span>
              <span className="font-bold">{phaseSpace3D.varianceExplainedPercent[0].toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-[width] duration-300"
                style={{ width: `${phaseSpace3D.varianceExplainedPercent[0]}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[0.62rem]">
              <span className="text-emerald-400">PC 2 (Minor)</span>
              <span className="font-bold">{phaseSpace3D.varianceExplainedPercent[1].toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-[width] duration-300"
                style={{ width: `${phaseSpace3D.varianceExplainedPercent[1]}%` }}
              />
            </div>
          </div>
        </div>

        {/* Col 4: Real-time Convergence Sparkline */}
        <div className="hidden lg:flex flex-col justify-between h-full bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
          <div className="text-[0.6rem] uppercase tracking-wider font-sans font-semibold text-slate-400 flex items-center justify-between">
            <span>Convergence</span>
            <TrendingDown className="h-3 w-3 text-emerald-400" />
          </div>

          <div className="my-1">
            <svg width="100%" height="34" viewBox="0 0 140 34" className="overflow-visible">
              <path
                d={sparklineData.path}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[0.6rem] font-mono text-slate-400">
            <span>Score:</span>
            <span className="font-bold text-sky-300">{bestFitness.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
