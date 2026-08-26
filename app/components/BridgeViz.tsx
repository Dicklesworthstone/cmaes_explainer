"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useInView } from "../hooks/useScrollSpy";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Building2,
  ShieldCheck,
  Activity,
  Zap,
  Compass,
  Layers,
  Sliders,
  Eye,
  Info
} from "lucide-react";
import {
  BridgeParams,
  TrussTopology,
  MaterialGrade,
  BRIDGE_PARAM_SPECS,
  evaluateBridgePhysics,
  decodeParameter,
  encodeParameter,
  initFrankenSim
} from "../lib/frankensimPhysics";
import { CMAESOptimizerND, CMAESGenerationStateND } from "../lib/cmaesEngineND";
import { FrankenSimBadge } from "./FrankenSimBadge";
import { CMAESPhaseSpaceViewer, CMAESTelemetryHUD } from "./CMAESPhaseSpaceViewer";

// Turbo colormap approximation for the deck stress overlay. The color
// coordinate is stress normalized by the selected material's yield, so the
// anchors are yield fractions, not fixed MPa values.
const TURBO_COLORS = [
  new THREE.Color("#30123b"), // 0.0: minimal stress
  new THREE.Color("#4683f6"), // 0.2 of yield
  new THREE.Color("#1bf1e8"), // 0.4 of yield
  new THREE.Color("#f1f927"), // 0.6 of yield
  new THREE.Color("#fa6e09"), // 0.8 of yield
  new THREE.Color("#7a0403")  // 1.0: at or above yield
];

const _tempColor = new THREE.Color();

function getTurboColor(t: number, target: THREE.Color = _tempColor): THREE.Color {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.2) target.lerpColors(TURBO_COLORS[0], TURBO_COLORS[1], t / 0.2);
  else if (t < 0.4) target.lerpColors(TURBO_COLORS[1], TURBO_COLORS[2], (t - 0.2) / 0.2);
  else if (t < 0.6) target.lerpColors(TURBO_COLORS[2], TURBO_COLORS[3], (t - 0.4) / 0.2);
  else if (t < 0.8) target.lerpColors(TURBO_COLORS[3], TURBO_COLORS[4], (t - 0.6) / 0.2);
  else target.lerpColors(TURBO_COLORS[4], TURBO_COLORS[5], (t - 0.8) / 0.2);
  return target;
}

// --- 3D Bridge Components ---

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[48, 48, 16, 16]} />
      <meshPhysicalMaterial
        color="#082f49"
        metalness={0.9}
        roughness={0.15}
        transmission={0.6}
        thickness={1.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Towers({ height, span, material }: { height: number; span: number; material: MaterialGrade }) {
  const h = 2.5 + height * 2.0;
  const x = span;

  const matColor = useMemo(() => {
    switch (material) {
      case "Ti-6Al-4V Titanium":
        return "#cbd5e1";
      case "CFRP Carbon Fiber":
        return "#1e293b";
      case "A992 High-Strength Steel":
        return "#94a3b8";
      default:
        return "#64748b";
    }
  }, [material]);

  return (
    <group>
      {/* Left Tower */}
      <group position={[-x, h / 2 - 1.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.65]}>
          <boxGeometry args={[0.28, h, 0.28]} />
          <meshStandardMaterial color={matColor} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.65]}>
          <boxGeometry args={[0.28, h, 0.28]} />
          <meshStandardMaterial color={matColor} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, h * 0.32, 0]}>
          <boxGeometry args={[0.22, 0.22, 1.5]} />
          <meshStandardMaterial color={matColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, -h * 0.25, 0]}>
          <boxGeometry args={[0.22, 0.22, 1.5]} />
          <meshStandardMaterial color={matColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Right Tower */}
      <group position={[x, h / 2 - 1.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.65]}>
          <boxGeometry args={[0.28, h, 0.28]} />
          <meshStandardMaterial color={matColor} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.65]}>
          <boxGeometry args={[0.28, h, 0.28]} />
          <meshStandardMaterial color={matColor} roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, h * 0.32, 0]}>
          <boxGeometry args={[0.22, 0.22, 1.5]} />
          <meshStandardMaterial color={matColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, -h * 0.25, 0]}>
          <boxGeometry args={[0.22, 0.22, 1.5]} />
          <meshStandardMaterial color={matColor} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function MainCables({ span, sag, towerHeight }: { span: number; sag: number; towerHeight: number }) {
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const h = 2.5 + towerHeight * 2.0;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = -span + (i / steps) * (2 * span);
      const y = (sag / (span * span)) * x * x + (h - sag);
      p.push(new THREE.Vector3(x, y, 0.65));
    }
    return p;
  }, [span, sag, towerHeight]);

  const points2 = useMemo(() => points.map((v) => new THREE.Vector3(v.x, v.y, -0.65)), [points]);

  return (
    <group>
      <Line points={points} color="#475569" lineWidth={3.5} />
      <Line points={points2} color="#475569" lineWidth={3.5} />
    </group>
  );
}

function Suspenders({
  span,
  sag,
  towerHeight,
  count
}: {
  span: number;
  sag: number;
  towerHeight: number;
  count: number;
}) {
  const lines = useMemo(() => {
    const els = [];
    const h = 2.5 + towerHeight * 2.0;
    const n = Math.max(8, Math.min(48, count));

    for (let i = 1; i < n; i++) {
      const x = -span + (i / n) * (2 * span);
      const topY = (sag / (span * span)) * x * x + (h - sag);
      const botY = 0;
      els.push(
        <mesh key={`f-${i}`} position={[x, (topY + botY) / 2, 0.65]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      );
      els.push(
        <mesh key={`b-${i}`} position={[x, (topY + botY) / 2, -0.65]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      );
    }
    return els;
  }, [span, sag, towerHeight, count]);

  return <group>{lines}</group>;
}

function TrussWebbing({
  span,
  topology,
  stiffness
}: {
  span: number;
  topology: TrussTopology;
  stiffness: number;
}) {
  const segments = 16;
  const lines = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const hTruss = 0.25 + stiffness * 0.35;
    const dx = (2 * span) / segments;

    for (let i = 0; i < segments; i++) {
      const x1 = -span + i * dx;
      const x2 = x1 + dx;

      // Top & bottom chords
      p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x2, 0, 0.65));
      p.push(new THREE.Vector3(x1, -hTruss, 0.65), new THREE.Vector3(x2, -hTruss, 0.65));

      // Web diagonals depending on topology
      if (topology === "Warren") {
        if (i % 2 === 0) {
          p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x2, -hTruss, 0.65));
        } else {
          p.push(new THREE.Vector3(x1, -hTruss, 0.65), new THREE.Vector3(x2, 0, 0.65));
        }
      } else if (topology === "Pratt") {
        p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x1, -hTruss, 0.65));
        p.push(new THREE.Vector3(x1, -hTruss, 0.65), new THREE.Vector3(x2, 0, 0.65));
      } else if (topology === "Bowstring Arch") {
        const archY = -hTruss + Math.sin((i / segments) * Math.PI) * 0.4;
        p.push(new THREE.Vector3(x1, archY, 0.65), new THREE.Vector3(x2, archY, 0.65));
        p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x1, archY, 0.65));
      } else {
        // Howe / K-Truss default
        p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x1, -hTruss, 0.65));
        p.push(new THREE.Vector3(x1, 0, 0.65), new THREE.Vector3(x2, -hTruss, 0.65));
      }
    }
    return p;
  }, [span, topology, stiffness]);

  return (
    <group>
      <Line points={lines} color="#334155" lineWidth={1.8} />
    </group>
  );
}

function DeckAnimator({
  span,
  stiffness,
  loadPos,
  maxStress,
  yieldLimit,
  maxDeflectionMm
}: {
  span: number;
  stiffness: number;
  loadPos: number;
  maxStress: number;
  yieldLimit: number;
  maxDeflectionMm: number;
}) {
  const segments = 48;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const getDeflection = (x: number, a: number) => {
    // Scene-space deflection driven by the analytical beam result: a global
    // sag shape scaled to the computed max deflection (exaggerated 60x so
    // millimetres read at bridge scale) plus a dip that travels with the truck.
    const metersPerSceneUnit = 50;
    const sagScene = (maxDeflectionMm / 1000 / metersPerSceneUnit) * 60;
    const shape = Math.cos((x / span) * Math.PI * 0.5); // 1 at midspan, 0 at the towers
    const dist = Math.abs(x - a);
    const localBump = 0.35 * Math.exp(-(dist * dist) / (0.35 + stiffness * 0.4));
    return -sagScene * shape * (0.65 + localBump);
  };

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = -span + t * (2 * span);
      const y = getDeflection(x, loadPos);

      const d = Math.abs(x - loadPos);
      const localStressRatio = Math.max(0, 1.0 - d * 1.2) * (maxStress / yieldLimit);
      const totalStressNorm = Math.min(1, 0.08 + localStressRatio * 0.85);
      getTurboColor(totalStressNorm, tempColor);

      dummy.position.set(x, y, 0);
      dummy.scale.set(((2 * span) / segments) * 1.02, 0.14, 1.3);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, segments]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.6} />
      </instancedMesh>

      {/* Moving Heavy Vehicle */}
      <mesh position={[loadPos, getDeflection(loadPos, loadPos) + 0.35, 0]}>
        <boxGeometry args={[0.45, 0.25, 0.55]} />
        <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

// --- Main Interactive BridgeViz Component ---

function decodeBridgeVector(v: number[]): BridgeParams {
  return {
    spanLength: Number(decodeParameter(v[0], BRIDGE_PARAM_SPECS[0]).value),
    cableSag: Number(decodeParameter(v[1], BRIDGE_PARAM_SPECS[1]).value),
    deckStiffness: Number(decodeParameter(v[2], BRIDGE_PARAM_SPECS[2]).value),
    trussTopology: String(decodeParameter(v[3], BRIDGE_PARAM_SPECS[3]).value) as TrussTopology,
    materialGrade: String(decodeParameter(v[4], BRIDGE_PARAM_SPECS[4]).value) as MaterialGrade,
    suspenderCount: Number(decodeParameter(v[5], BRIDGE_PARAM_SPECS[5]).value),
    towerAspect: Number(decodeParameter(v[6], BRIDGE_PARAM_SPECS[6]).value),
    vibrationDamping: Number(decodeParameter(v[7], BRIDGE_PARAM_SPECS[7]).value)
  };
}

export function BridgeViz() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(canvasContainerRef, { rootMargin: "250px 0px 250px 0px" });

  // 8 Physical Input Parameters
  const [params, setParams] = useState<BridgeParams>({
    spanLength: 180,
    cableSag: 18,
    deckStiffness: 0.45,
    trussTopology: "Warren",
    materialGrade: "A36 Mild Steel",
    suspenderCount: 24,
    towerAspect: 0.35,
    vibrationDamping: 0.05
  });

  const [isExpanded3D, setIsExpanded3D] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [loadPos, setLoadPos] = useState(0);

  // CMA-ES State with lazy initialization
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);
  const [latestStateND, setLatestStateND] = useState<CMAESGenerationStateND | null>(() => {
    const optimizer = new CMAESOptimizerND(
      (zVec) => {
        const decoded = decodeBridgeVector(zVec);
        const result = evaluateBridgePhysics(decoded, 0);
        return result.costScore;
      },
      {
        dim: 8,
        initialMean: [
          encodeParameter(180, BRIDGE_PARAM_SPECS[0]),
          encodeParameter(18, BRIDGE_PARAM_SPECS[1]),
          encodeParameter(0.45, BRIDGE_PARAM_SPECS[2]),
          encodeParameter("Warren", BRIDGE_PARAM_SPECS[3]),
          encodeParameter("A36 Mild Steel", BRIDGE_PARAM_SPECS[4]),
          encodeParameter(24, BRIDGE_PARAM_SPECS[5]),
          encodeParameter(0.35, BRIDGE_PARAM_SPECS[6]),
          encodeParameter(0.05, BRIDGE_PARAM_SPECS[7])
        ],
        initialSigma: 0.25,
        lambda: 16,
        bounds: [0.0, 1.0]
      }
    );
    return optimizer.step();
  });
  const [historyND, setHistoryND] = useState<CMAESGenerationStateND[]>(() =>
    latestStateND ? [latestStateND] : []
  );
  const optIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Convert 8 parameters to/from [0, 1]^8 vector
  const paramVector = useMemo(() => {
    return [
      encodeParameter(params.spanLength, BRIDGE_PARAM_SPECS[0]),
      encodeParameter(params.cableSag, BRIDGE_PARAM_SPECS[1]),
      encodeParameter(params.deckStiffness, BRIDGE_PARAM_SPECS[2]),
      encodeParameter(params.trussTopology, BRIDGE_PARAM_SPECS[3]),
      encodeParameter(params.materialGrade, BRIDGE_PARAM_SPECS[4]),
      encodeParameter(params.suspenderCount, BRIDGE_PARAM_SPECS[5]),
      encodeParameter(params.towerAspect, BRIDGE_PARAM_SPECS[6]),
      encodeParameter(params.vibrationDamping, BRIDGE_PARAM_SPECS[7])
    ];
  }, [params]);

  // Decode a unit vector [0, 1]^8 back to physical BridgeParams
  const decodeVectorToParams = useCallback((v: number[]): BridgeParams => {
    return decodeBridgeVector(v);
  }, []);

  // The FrankenSim WASM kernel loads asynchronously; the readiness flag in
  // the memo deps re-evaluates with the kernel once it arrives instead of
  // waiting for the next parameter change.
  const [fsPhysicsReady, setFsPhysicsReady] = useState(false);
  useEffect(() => {
    let live = true;
    initFrankenSim().then((s) => {
      if (live && s.hasDemoPhysics) setFsPhysicsReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  // Real physical analysis output
  const analysis = useMemo(() => {
    void fsPhysicsReady;
    // loadPos lives in scene units; 2 * span3D units span the full deck, so
    // one scene unit is 50 m regardless of span length.
    return evaluateBridgePhysics(params, loadPos * 50);
  }, [params, loadPos, fsPhysicsReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    };
  }, []);

  // Moving truck animation loop — paused offscreen: a 33 Hz setState here
  // re-renders the whole component tree for nobody.
  useEffect(() => {
    if (!autoRun || !isInView) return;
    let t = 0;
    const interval = setInterval(() => {
      t += 0.04;
      setLoadPos(Math.sin(t) * (params.spanLength * 0.01 - 0.3));
    }, 30);
    return () => clearInterval(interval);
  }, [autoRun, isInView, params.spanLength]);

  // Run live 8D CMA-ES Optimization with 3D Phase-Space PCA Projection
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
      setIsOptimizing(false);
      return;
    }

    setIsOptimizing(true);
    setOptGen(0);
    setHistoryND([]);

    const optimizer = new CMAESOptimizerND(
      (zVec) => {
        const decoded = decodeVectorToParams(zVec);
        const result = evaluateBridgePhysics(decoded, 0);
        return result.costScore;
      },
      {
        dim: 8,
        initialMean: [...paramVector],
        initialSigma: 0.25,
        lambda: 16,
        bounds: [0.0, 1.0]
      }
    );

    let g = 0;
    const maxG = 25;
    if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    optIntervalRef.current = setInterval(() => {
      g++;
      const state = optimizer.step();
      const bestP = decodeVectorToParams(state.bestX);
      setParams(bestP);
      setOptGen(g);
      setLatestStateND(state);
      setHistoryND((prev) => [...prev, state]);

      if (g >= maxG) {
        if (optIntervalRef.current) clearInterval(optIntervalRef.current);
        setIsOptimizing(false);
      }
    }, 180);
  };

  // Normalized 3D scale values for Three.js
  const span3D = params.spanLength * 0.01;
  const sag3D = params.cableSag * 0.06;

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      {/* Top Header with FrankenSim Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Multi-Parameter Bridge Structural Optimization
            </h3>
            <p className="text-xs text-slate-400">
              8-Dimensional Mixed Continuous, Discrete & Categorical Parameter Search
            </p>
          </div>
        </div>

        {/* FrankenSim.org Physics Badge */}
        <FrankenSimBadge />
      </div>

      {/* Main Grid: Viewport/Phase-Space & Control Panel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Viewport / Phase Space Container */}
        <div className="lg:w-[62%] w-full min-w-0 space-y-4">
          {/* Main 3D Canvas Stage (Single or Split 3D View) */}
          {isExpanded3D ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 3D Physical Bridge Canvas */}
              <div ref={canvasContainerRef} className="relative group aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b1120]">
                <Canvas
                  shadows
                  dpr={[1, 2]}
                  events={safePointerEvents}
                  frameloop={isInView ? "always" : "demand"}
                >
                  <PerspectiveCamera makeDefault position={[0.8, 2.2, 7.2]} fov={38} />
                  <color attach="background" args={["#0b1120"]} />
                  <fog attach="fog" args={["#0b1120", 6, 28]} />

                  <ambientLight intensity={0.5} />
                  <directionalLight position={[6, 12, 6]} intensity={1.4} castShadow />
                  <pointLight position={[-6, 4, -4]} intensity={0.6} color="#38bdf8" />
                  <directionalLight position={[0, 10, 0]} intensity={0.6} color="#bae6fd" />

                  <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={3.5}
                    maxDistance={14}
                    maxPolarAngle={Math.PI / 2 + 0.05}
                    target={[0, 0.3, 0]}
                  />

                  <group position={[0, -0.4, 0]}>
                    <Water />
                    <Towers height={params.towerAspect} span={span3D} material={params.materialGrade} />
                    <MainCables span={span3D} sag={sag3D} towerHeight={params.towerAspect} />
                    <Suspenders
                      span={span3D}
                      sag={sag3D}
                      towerHeight={params.towerAspect}
                      count={params.suspenderCount}
                    />
                    <TrussWebbing
                      span={span3D}
                      topology={params.trussTopology}
                      stiffness={params.deckStiffness}
                    />
                    <DeckAnimator
                      span={span3D}
                      stiffness={params.deckStiffness}
                      loadPos={loadPos}
                      maxStress={analysis.maxVonMisesStressMPa}
                      yieldLimit={analysis.yieldLimitMPa}
                      maxDeflectionMm={analysis.maxDeflectionMm}
                    />
                  </group>
                </Canvas>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 text-[0.62rem] font-bold text-amber-300 backdrop-blur-md">
                  Analytic Beam + Cable Model
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
            <div ref={canvasContainerRef} className="relative group aspect-[16/10] sm:aspect-auto lg:h-[460px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b1120]">
              <Canvas
                shadows
                dpr={[1, 2]}
                events={safePointerEvents}
                frameloop={isInView ? "always" : "demand"}
              >
                <PerspectiveCamera makeDefault position={[0.8, 2.2, 7.2]} fov={38} />
                <color attach="background" args={["#0b1120"]} />
                <fog attach="fog" args={["#0b1120", 6, 28]} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[6, 12, 6]} intensity={1.4} castShadow />
                <pointLight position={[-6, 4, -4]} intensity={0.6} color="#38bdf8" />
                <directionalLight position={[0, 10, 0]} intensity={0.6} color="#bae6fd" />

                <OrbitControls
                  makeDefault
                  enableDamping
                  dampingFactor={0.06}
                  minDistance={3.5}
                  maxDistance={14}
                  maxPolarAngle={Math.PI / 2 + 0.05}
                  target={[0, 0.3, 0]}
                />

                <group position={[0, -0.4, 0]}>
                  <Water />
                  <Towers height={params.towerAspect} span={span3D} material={params.materialGrade} />
                  <MainCables span={span3D} sag={sag3D} towerHeight={params.towerAspect} />
                  <Suspenders
                    span={span3D}
                    sag={sag3D}
                    towerHeight={params.towerAspect}
                    count={params.suspenderCount}
                  />
                  <TrussWebbing
                    span={span3D}
                    topology={params.trussTopology}
                    stiffness={params.deckStiffness}
                  />
                  <DeckAnimator
                    span={span3D}
                    stiffness={params.deckStiffness}
                    loadPos={loadPos}
                    maxStress={analysis.maxVonMisesStressMPa}
                    yieldLimit={analysis.yieldLimitMPa}
                    maxDeflectionMm={analysis.maxDeflectionMm}
                  />
                </group>
              </Canvas>

              {/* Orbit hint */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[0.62rem] sm:text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
                <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
                <span>Drag to orbit 3D model</span>
              </div>

              {/* FEA Stress Colormap Legend (desktop only: 176px of panel on
                  a phone-width canvas hides the bridge; mobile shows the
                  same numbers in the strip under the viewport) */}
              <div className="hidden sm:flex absolute sm:bottom-4 sm:right-4 p-2.5 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex-col gap-1.5 w-44 sm:w-56 shadow-2xl pointer-events-none">
                <div className="flex items-center justify-between text-[0.62rem] sm:text-[0.68rem] font-bold text-slate-200 uppercase tracking-wider">
                  <span>Deck Stress</span>
                  <span
                    className={
                      analysis.maxVonMisesStressMPa > analysis.yieldLimitMPa
                        ? "text-rose-400 font-mono"
                        : "text-emerald-400 font-mono"
                    }
                  >
                    {analysis.maxVonMisesStressMPa} MPa
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 w-full rounded-full bg-gradient-to-r from-[#30123b] via-[#1bf1e8] to-[#7a0403]" />
                <div className="flex justify-between text-[0.58rem] sm:text-[0.62rem] text-slate-400 font-mono">
                  <span>0</span>
                  <span>0.5&middot;&sigma;<sub>y</sub></span>
                  <span>&sigma;<sub>y</sub> = {analysis.yieldLimitMPa} MPa</span>
                </div>
              </div>

              {/* Status Pill (desktop only; see mobile strip) */}
              <div className="hidden sm:flex absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex-col gap-1.5 pointer-events-none">
                <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950/85 text-xs text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold uppercase tracking-wider text-[0.6rem] sm:text-[0.65rem] text-slate-400">Total Mass:</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-amber-200">{analysis.totalMassTons} Tons</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile FEA telemetry strip (replaces the in-viewport overlays) */}
          <div className="sm:hidden space-y-1 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-[0.68rem] font-mono text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span>
                <span className="text-slate-500 uppercase text-[0.6rem]">Deck Stress</span>{" "}
                <span
                  className={`font-bold ${
                    analysis.maxVonMisesStressMPa > analysis.yieldLimitMPa ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {analysis.maxVonMisesStressMPa} MPa
                </span>{" "}
                <span className="text-slate-500">/ σ<sub>y</sub> {analysis.yieldLimitMPa}</span>
              </span>
              <span>
                <span className="text-slate-500 uppercase text-[0.6rem]">Mass</span>{" "}
                <span className="font-bold text-amber-200">{analysis.totalMassTons} t</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#30123b] via-[#1bf1e8] to-[#7a0403]" />
          </div>

          {/* Unified Live CMA-ES Internal State Telemetry HUD (Directly at the bottom) */}
          <CMAESTelemetryHUD
            latestState={latestStateND}
            history={historyND}
            isOptimizing={isOptimizing}
            maxGen={25}
            onToggleExpand3D={() => setIsExpanded3D((prev) => !prev)}
            isExpanded3D={isExpanded3D}
            accentColor="amber"
            objectiveName="Cost Score"
          />
        </div>

        {/* 8-Parameter Control Panel */}
        <div className="flex-1 space-y-5 w-full">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
              <span>Bridge Design Parameters</span>
              <span className="font-mono text-[0.68rem] text-slate-400">8D Parameter Space</span>
            </div>
            <p className="text-xs text-slate-300">
              Discrete topologies & materials are smoothly partitioned across continuous <code className="text-amber-300 font-mono">[0, 1]</code> interval bins.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  setParams({
                    spanLength: 280,
                    cableSag: 28,
                    deckStiffness: 0.35,
                    trussTopology: "Warren",
                    materialGrade: "A992 High-Strength Steel",
                    suspenderCount: 32,
                    towerAspect: 0.42,
                    vibrationDamping: 0.06
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                🌉 Long-Span Suspension
              </button>
              <button
                type="button"
                onClick={() =>
                  setParams({
                    spanLength: 140,
                    cableSag: 12,
                    deckStiffness: 0.85,
                    trussTopology: "Bowstring Arch",
                    materialGrade: "A36 Mild Steel",
                    suspenderCount: 20,
                    towerAspect: 0.3,
                    vibrationDamping: 0.08
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
              >
                🏗️ Heavy Transit Arch
              </button>
              <button
                type="button"
                onClick={() =>
                  setParams({
                    spanLength: 200,
                    cableSag: 22,
                    deckStiffness: 0.5,
                    trussTopology: "Pratt",
                    materialGrade: "Ti-6Al-4V Titanium",
                    suspenderCount: 28,
                    towerAspect: 0.38,
                    vibrationDamping: 0.04
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
              >
                ⚡ Titanium Aero-Truss
              </button>
            </div>
          </div>

          <div className="space-y-3.5 bg-slate-900/50 rounded-2xl p-4 border border-white/5 max-h-[440px] overflow-y-auto pr-2">
            {/* 1. Span Length */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[0].label}</span>
                <span className="text-amber-300 font-mono text-xs">{params.spanLength} m</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[0].label}
                min={BRIDGE_PARAM_SPECS[0].min}
                max={BRIDGE_PARAM_SPECS[0].max}
                step={BRIDGE_PARAM_SPECS[0].step}
                value={params.spanLength}
                onChange={(e) => setParams({ ...params, spanLength: parseFloat(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* 2. Cable Sag */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[1].label}</span>
                <span className="text-sky-300 font-mono text-xs">{params.cableSag.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[1].label}
                min={BRIDGE_PARAM_SPECS[1].min}
                max={BRIDGE_PARAM_SPECS[1].max}
                step={BRIDGE_PARAM_SPECS[1].step}
                value={params.cableSag}
                onChange={(e) => setParams({ ...params, cableSag: parseFloat(e.target.value) })}
                className="w-full accent-sky-400"
              />
            </div>

            {/* 3. Deck Stiffness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[2].label}</span>
                <span className="text-emerald-300 font-mono text-xs">{Math.round(params.deckStiffness * 100)}%</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[2].label}
                min={BRIDGE_PARAM_SPECS[2].min}
                max={BRIDGE_PARAM_SPECS[2].max}
                step={BRIDGE_PARAM_SPECS[2].step}
                value={params.deckStiffness}
                onChange={(e) => setParams({ ...params, deckStiffness: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400"
              />
            </div>

            {/* 4. Categorical Truss Web Topology */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Truss Web Topology</span>
                <span className="text-purple-300 font-mono text-[0.68rem]">{params.trussTopology}</span>
              </div>
              <select
                aria-label="Truss Web Topology"
                value={params.trussTopology}
                onChange={(e) => setParams({ ...params, trussTopology: e.target.value as TrussTopology })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
              >
                {BRIDGE_PARAM_SPECS[3].categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Categorical Structural Material */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Material Grade</span>
                <span className="text-indigo-300 font-mono text-[0.68rem]">{params.materialGrade}</span>
              </div>
              <select
                aria-label="Material Grade"
                value={params.materialGrade}
                onChange={(e) => setParams({ ...params, materialGrade: e.target.value as MaterialGrade })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
              >
                {BRIDGE_PARAM_SPECS[4].categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Discrete Suspender Cables */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[5].label}</span>
                <span className="text-cyan-300 font-mono text-xs">{params.suspenderCount}</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[5].label}
                min={BRIDGE_PARAM_SPECS[5].min}
                max={BRIDGE_PARAM_SPECS[5].max}
                step={BRIDGE_PARAM_SPECS[5].step}
                value={params.suspenderCount}
                onChange={(e) => setParams({ ...params, suspenderCount: parseInt(e.target.value, 10) })}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* 7. Tower Pylon Aspect */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[6].label}</span>
                <span className="text-rose-300 font-mono text-xs">{params.towerAspect.toFixed(2)}</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[6].label}
                min={BRIDGE_PARAM_SPECS[6].min}
                max={BRIDGE_PARAM_SPECS[6].max}
                step={BRIDGE_PARAM_SPECS[6].step}
                value={params.towerAspect}
                onChange={(e) => setParams({ ...params, towerAspect: parseFloat(e.target.value) })}
                className="w-full accent-rose-400"
              />
            </div>

            {/* 8. Tuned Mass Damping */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{BRIDGE_PARAM_SPECS[7].label}</span>
                <span className="text-teal-300 font-mono text-xs">{(params.vibrationDamping * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                aria-label={BRIDGE_PARAM_SPECS[7].label}
                min={BRIDGE_PARAM_SPECS[7].min}
                max={BRIDGE_PARAM_SPECS[7].max}
                step={BRIDGE_PARAM_SPECS[7].step}
                value={params.vibrationDamping}
                onChange={(e) => setParams({ ...params, vibrationDamping: parseFloat(e.target.value) })}
                className="w-full accent-teal-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRunOptimizer}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-[background-color,box-shadow,transform] shadow-lg ${
                isOptimizing
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:scale-[1.02] shadow-orange-500/30"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isOptimizing ? "Stop Optimization" : "Run 8D CMA-ES Optimization"}</span>
            </button>

            <button
              onClick={() => setAutoRun(!autoRun)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-3 text-xs font-medium text-slate-200 transition-colors"
            >
              {autoRun ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{autoRun ? "Pause Traffic" : "Resume"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
