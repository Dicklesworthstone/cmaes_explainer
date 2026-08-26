"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Environment, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Sparkles, Building2, ShieldCheck, Activity, Zap, Compass } from "lucide-react";
import { CMAESOptimizer } from "../lib/cmaesEngine";

// --- Physics & Colormap Helpers ---

// Turbo colormap approximation for FEA stress representation
const TURBO_COLORS = [
  new THREE.Color("#30123b"), // 0.0: Safe / Minimal Stress
  new THREE.Color("#4683f6"), // 0.2: Low Stress (~100 MPa)
  new THREE.Color("#1bf1e8"), // 0.4: Moderate Stress (~200 MPa)
  new THREE.Color("#f1f927"), // 0.6: High Stress (~300 MPa)
  new THREE.Color("#fa6e09"), // 0.8: Critical Stress (~400 MPa)
  new THREE.Color("#7a0403")  // 1.0: Failure / Yield Exceeded (>500 MPa)
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
      <planeGeometry args={[36, 36, 16, 16]} />
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

function Towers({ height, span }: { height: number; span: number }) {
  const h = 2.5 + height * 1.5;
  const x = span;

  return (
    <group>
      {/* Left Tower */}
      <group position={[-x, h / 2 - 1.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, h * 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
        <mesh position={[0, -h * 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Tower */}
      <group position={[x, h / 2 - 1.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, h * 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
        <mesh position={[0, -h * 0.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function MainCables({ span, sag, towerHeight }: { span: number; sag: number; towerHeight: number }) {
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const h = 2.5 + towerHeight * 1.5;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = -span + (i / steps) * (2 * span);
      const y = (sag / (span * span)) * x * x + (h - sag);
      p.push(new THREE.Vector3(x, y, 0.6));
    }
    return p;
  }, [span, sag, towerHeight]);

  const points2 = useMemo(() => points.map((v) => new THREE.Vector3(v.x, v.y, -0.6)), [points]);

  return (
    <group>
      <Line points={points} color="#64748b" lineWidth={3.5} />
      <Line points={points2} color="#64748b" lineWidth={3.5} />
    </group>
  );
}

function Suspenders({ span, sag, towerHeight }: { span: number; sag: number; towerHeight: number }) {
  const count = 20;
  const lines = useMemo(() => {
    const els = [];
    const h = 2.5 + towerHeight * 1.5;

    for (let i = 1; i < count; i++) {
      const x = -span + (i / count) * (2 * span);
      const topY = (sag / (span * span)) * x * x + (h - sag);
      const botY = 0;
      els.push(
        <mesh key={`f-${i}`} position={[x, (topY + botY) / 2, 0.6]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      );
      els.push(
        <mesh key={`b-${i}`} position={[x, (topY + botY) / 2, -0.6]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      );
    }
    return els;
  }, [span, sag, towerHeight]);

  return <group>{lines}</group>;
}

function DeckAnimator({
  span,
  stiffness,
  loadMass,
  loadPos,
  windVibration
}: {
  span: number;
  stiffness: number;
  loadMass: number;
  loadPos: number;
  windVibration: number;
}) {
  const segments = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const getDeflection = (x: number, a: number) => {
    const dist = Math.abs(x - a);
    const peak = (loadMass * 0.55) / (0.1 + stiffness * 1.8);
    const flutter = windVibration * Math.sin(x * 3.5) * 0.08;
    return -peak * Math.exp(-(dist * dist) / (0.25 + stiffness * 0.35)) + flutter;
  };

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = -span + t * (2 * span);

      const y = getDeflection(x, loadPos);

      // Real FEA stress calculation: bending stress sigma_b + tensile hanger reaction
      const d = Math.abs(x - loadPos);
      const localStress = Math.max(0, 1.0 - d * 1.4) * (loadMass / (0.2 + stiffness));
      const towerStress = Math.exp(-Math.pow(Math.abs(x) - span, 2) / 0.15) * 0.6;
      const windStress = windVibration * 0.3;

      const totalStressNormalized = Math.min(1, 0.05 + localStress * 0.65 + towerStress + windStress);
      getTurboColor(totalStressNormalized, tempColor);

      dummy.position.set(x, y, 0);
      dummy.scale.set(((2 * span) / segments) * 1.02, 0.14, 1.25);
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

      {/* Moving Heavy Vehicle Visual Indicator */}
      <mesh position={[loadPos, getDeflection(loadPos, loadPos) + 0.35, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.5]} />
        <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// --- Main BridgeViz Component with Real CMA-ES Auto-Optimizer ---

export function BridgeViz() {
  const [span, setSpan] = useState(1.6);
  const [sag, setSag] = useState(1.1);
  const [stiffness, setStiffness] = useState(0.45);
  const [load, setLoad] = useState(0.5); // 0 to 1
  const [wind, setWind] = useState(0.3); // 0 to 1
  const [autoRun, setAutoRun] = useState(true);

  // CMA-ES Optimizer state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);
  const [optFitness, setOptFitness] = useState<number | null>(null);

  // Moving truck position
  const [loadPos, setLoadPos] = useState(0);

  useEffect(() => {
    if (!autoRun) return;
    let t = 0;
    const interval = setInterval(() => {
      t += 0.04;
      setLoadPos(Math.sin(t) * (span - 0.3));
    }, 30);
    return () => clearInterval(interval);
  }, [autoRun, span]);

  // Bridge structural cost function:
  // Objective: Minimize total bridge steel mass (M) subject to MaxStress <= 350 MPa
  const bridgeObjective = (pSpan: number, pSag: number, pStiff: number) => {
    // Structural mass: main cable steel (proportional to span^2 / sag) + deck steel + towers
    const cableMass = (pSpan * pSpan) / Math.max(0.2, pSag) * 12;
    const deckMass = pSpan * (0.5 + pStiff * 2.5) * 15;
    const towerMass = (2.5 + pSag * 0.8) * 8;
    const totalMass = cableMass + deckMass + towerMass;

    // Peak stress calculation
    const maxLocalStress = (1.5 / (0.15 + pStiff * 1.8)) * 250;
    const maxCableTension = (pSpan * pSpan) / (8 * Math.max(0.2, pSag)) * 40;
    const peakStress = maxLocalStress + maxCableTension + wind * 80;

    // Constraint penalty if peakStress > 350 MPa limit
    const penalty = peakStress > 350 ? Math.pow(peakStress - 350, 2) * 5 : 0;
    return totalMass + penalty;
  };

  // Run live CMA-ES Optimization loop
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      setIsOptimizing(false);
      return;
    }

    setIsOptimizing(true);
    setOptGen(0);

    // Optimize 3 parameters: span in [1.2, 2.2], sag in [0.5, 2.0], stiffness in [0.2, 1.0]
    const optimizer = new CMAESOptimizer(
      (x, y) => {
        // x maps to sag [0.5, 2.0], y maps to stiffness [0.2, 1.0]
        return bridgeObjective(span, x, y);
      },
      {
        dim: 2,
        initialMean: [sag, stiffness],
        initialSigma: 0.25,
        lambda: 12,
        bounds: [0.2, 2.2]
      }
    );

    let currentGen = 0;
    const maxG = 25;
    const interval = setInterval(() => {
      currentGen++;
      const state = optimizer.step();
      setSag(Math.max(0.5, Math.min(2.0, state.bestX[0])));
      setStiffness(Math.max(0.15, Math.min(1.0, state.bestX[1])));
      setOptGen(currentGen);
      setOptFitness(state.bestFitness);

      if (currentGen >= maxG) {
        clearInterval(interval);
        setIsOptimizing(false);
      }
    }, 180);
  };

  // Max stress estimate for UI
  const currentMaxStress = useMemo(() => {
    const maxLocalStress = (1.5 / (0.15 + stiffness * 1.8)) * 250;
    const maxCableTension = (span * span) / (8 * Math.max(0.2, sag)) * 40;
    return Math.min(500, Math.round(maxLocalStress + maxCableTension + wind * 80));
  }, [span, sag, stiffness, wind]);

  const estimatedMassTons = useMemo(() => {
    const cableMass = (span * span) / Math.max(0.2, sag) * 12;
    const deckMass = span * (0.5 + stiffness * 2.5) * 15;
    const towerMass = (2.5 + sag * 0.8) * 8;
    return Math.round((cableMass + deckMass + towerMass) * 10);
  }, [span, sag, stiffness]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Viewport */}
        <div className="lg:w-[65%] w-full relative group aspect-[16/10] sm:aspect-auto lg:h-[480px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b1120]">
            <Canvas shadows dpr={[1, 2]} events={safePointerEvents}>
              {/* Centered isometric perspective showing full span symmetrically */}
              <PerspectiveCamera makeDefault position={[0.8, 2.2, 7.2]} fov={38} />
              <color attach="background" args={["#0b1120"]} />
              <fog attach="fog" args={["#0b1120", 6, 26]} />

              <ambientLight intensity={0.5} />
              <directionalLight position={[6, 12, 6]} intensity={1.4} castShadow />
              <pointLight position={[-6, 4, -4]} intensity={0.6} color="#38bdf8" />
              <Environment preset="sunset" />

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
                <Towers height={0.5} span={span} />
                <MainCables span={span} sag={sag} towerHeight={0.5} />
                <Suspenders span={span} sag={sag} towerHeight={0.5} />
                <DeckAnimator
                  span={span}
                  stiffness={stiffness}
                  loadMass={0.6 + load * 1.2}
                  loadPos={loadPos}
                  windVibration={wind}
                />
              </group>
            </Canvas>

            {/* Orbit & Interaction Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>Drag to orbit • Scroll to zoom</span>
            </div>

            {/* FEA Stress Colormap Legend */}
            <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex flex-col gap-2 w-52 shadow-2xl">
              <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-200 uppercase tracking-wider">
                <span>von Mises Stress</span>
                <span className={currentMaxStress > 350 ? "text-rose-400 font-mono" : "text-emerald-400 font-mono"}>
                  {currentMaxStress} MPa
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#30123b] via-[#1bf1e8] to-[#7a0403]" />
              <div className="flex justify-between text-[0.62rem] text-slate-400 font-mono">
                <span>0 MPa (Safe)</span>
                <span>350 (Limit)</span>
                <span>500 (Yield)</span>
              </div>
            </div>

            {/* Live Optimizer HUD Badge */}
            {isOptimizing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-500/40 shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-sky-200">
                  CMA-ES Optimizing: Gen {optGen}/25
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Optimization Panel */}
        <div className="flex-1 space-y-6 w-full py-1">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              <Building2 className="h-4 w-4" />
              <span>Structural FEA Simulation</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solve the nonlinear structural trade-off: deep cable sag reduces tensile tension but increases wind flutter; stiffening the deck prevents local deflection but adds deadweight.
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-4 bg-slate-900/40 rounded-2xl p-5 border border-white/5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Main Span Length <span className="font-mono text-amber-400">(L)</span></span>
                <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {(span * 100).toFixed(0)} m
                </span>
              </div>
              <input
                type="range"
                min={1.2}
                max={2.2}
                step={0.05}
                value={span}
                onChange={(e) => setSpan(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Cable Sag <span className="font-mono text-sky-400">(s)</span></span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {(sag * 20).toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.05}
                value={sag}
                onChange={(e) => setSag(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Deck Truss Stiffness <span className="font-mono text-emerald-400">(k)</span></span>
                <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {(stiffness * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.15}
                max={1.0}
                step={0.02}
                value={stiffness}
                onChange={(e) => setStiffness(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Wind Vortex Flutter <span className="font-mono text-purple-400">(v)</span></span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {(wind * 100).toFixed(0)} km/h
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={wind}
                onChange={(e) => setWind(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <div className="text-[0.65rem] text-slate-500 uppercase">Estimated Mass</div>
              <div className="text-base font-bold text-slate-200 mt-0.5">{estimatedMassTons} Tons</div>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <div className="text-[0.65rem] text-slate-500 uppercase">Safety Envelope</div>
              <div className={`text-base font-bold mt-0.5 ${currentMaxStress <= 350 ? "text-emerald-400" : "text-rose-400"}`}>
                {currentMaxStress <= 350 ? "Compliant" : "Violated"}
              </div>
            </div>
          </div>

          {/* Live CMA-ES Trigger & Traffic Button */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRunOptimizer}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all shadow-lg ${
                isOptimizing
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                  : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:scale-[1.02] shadow-sky-500/30"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{isOptimizing ? "Stop Optimization" : "Run Live CMA-ES Optimizer"}</span>
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
