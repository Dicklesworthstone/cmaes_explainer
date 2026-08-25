"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Environment, Float } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Play, Pause, Sparkles, Wind, PlaneTakeoff, Gauge, Activity } from "lucide-react";
import { CMAESOptimizer } from "../lib/cmaesEngine";

// --- NACA 4-Digit Airfoil & 3D Wing Geometry Generator ---

function getNacaShape(m: number, p: number, t: number, chord: number = 1.4, points = 80): THREE.Shape {
  const shape = new THREE.Shape();
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * chord;
    let yc = 0;
    let dyc_dx = 0;

    if (p > 0 && m > 0) {
      if (x <= p * chord) {
        yc = (m / (p * p)) * (2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / (p * p)) * (p - x / chord);
      } else {
        yc = (m / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / ((1 - p) ** 2)) * (p - x / chord);
      }
    }

    const yt =
      5 *
      t *
      (0.2969 * Math.sqrt(Math.max(0, x / chord)) -
        0.126 * (x / chord) -
        0.3516 * (x / chord) ** 2 +
        0.2843 * (x / chord) ** 3 -
        0.1015 * (x / chord) ** 4);

    const theta = Math.atan(dyc_dx);
    upper.push([x - yt * Math.sin(theta) - chord / 2, yc + yt * Math.cos(theta)]);
    lower.push([x + yt * Math.sin(theta) - chord / 2, yc - yt * Math.cos(theta)]);
  }

  shape.moveTo(upper[0][0], upper[0][1]);
  for (const pt of upper) shape.lineTo(pt[0], pt[1]);
  for (let i = lower.length - 1; i >= 0; i--) shape.lineTo(lower[i][0], lower[i][1]);
  shape.closePath();

  return shape;
}

function ParametricWingMesh({
  aspect,
  sweep,
  thickness,
  camber
}: {
  aspect: number;
  sweep: number;
  thickness: number;
  camber: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // NACA Parameters
  const m = 0.01 + camber * 0.06; // 1% to 7% camber
  const p = 0.4;
  const t = 0.06 + thickness * 0.16; // 6% to 22% thickness
  const span = 1.6 + aspect * 2.4; // Wing half-span width

  const geometry = useMemo(() => {
    const shape = getNacaShape(m, p, t, 1.4);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: span,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      steps: 1
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    // Apply sweep angle skew along span axis (z)
    const pos = geom.attributes.position;
    const sweepSkew = sweep * 1.2;
    for (let i = 0; i < pos.count; i++) {
      const zVal = pos.getZ(i);
      const spanNorm = Math.abs(zVal) / (span / 2);
      const currentX = pos.getX(i);
      pos.setX(i, currentX - spanNorm * sweepSkew);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, [m, p, t, span, sweep]);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Subtle aerodynamic float oscillation
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#f8fafc"
          metalness={0.8}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

// --- 3D Wind Tunnel CFD Streamlines ---

function CFDStreamlines({ speed = 1.2, liftStrength = 1.0 }: { speed?: number; liftStrength?: number }) {
  const count = 280;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 4.5,
      z: (Math.random() - 0.5) * 6.5,
      speed: 0.8 + Math.random() * 0.6
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.x += p.speed * speed * 7.5 * delta;

      if (p.x > 6) {
        p.x = -6;
        p.y = (Math.random() - 0.5) * 4.5;
        p.z = (Math.random() - 0.5) * 6.5;
      }

      // Aerodynamic downwash deflection (Bernoulli effect)
      const dist = Math.hypot(p.x, p.y);
      if (dist < 2.2) {
        const deflection = (1.0 - dist / 2.2) * liftStrength * 0.12;
        p.y -= deflection * delta * 12;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.9 + p.speed * 0.4, 0.025, 0.025);
      dummy.rotation.z = dist < 2.2 ? -liftStrength * 0.3 * (1 - dist / 2.2) : 0;
      dummy.updateMatrix();

      // Color coding: Fast/Low-pressure (Top) = Cyan/Blue; Slow/High-pressure (Bottom) = Gold/Amber
      const pressureNorm = Math.max(0, Math.min(1, 0.5 + (p.y / 2.0)));
      tempColor.setHSL(0.55 - pressureNorm * 0.2, 0.9, 0.6);

      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// --- Main WingViz Component ---

export function WingViz() {
  const [aspect, setAspect] = useState(0.65); // Aspect Ratio [0, 1] -> [6, 14]
  const [sweep, setSweep] = useState(0.42); // Sweep Angle [0, 1] -> [0 deg, 40 deg]
  const [thickness, setThickness] = useState(0.4); // Thickness [0, 1] -> [6%, 22%]
  const [camber, setCamber] = useState(0.5); // Camber [0, 1] -> [1%, 7%]

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);

  // Aerodynamic equations (Lifting line theory approximation)
  const aero = useMemo(() => {
    const AR = 6 + aspect * 8; // 6 to 14
    const sweepDeg = sweep * 40; // 0 to 40 deg
    const sweepRad = (sweepDeg * Math.PI) / 180;
    const tThick = 0.06 + thickness * 0.16;
    const mCamber = 0.01 + camber * 0.06;

    // Lift coefficient CL
    const clAlpha = (2 * Math.PI * AR) / (AR + 2 * Math.cos(sweepRad));
    const CL = clAlpha * 0.08 + mCamber * 8.0;

    // Drag components: Induced Drag CDi + Profile Drag CD0 + Wave Drag CDw
    const eOswald = 0.85;
    const CDi = (CL * CL) / (Math.PI * eOswald * AR);
    const CD0 = 0.008 + 1.2 * (tThick * tThick);
    const waveDrag = Math.max(0, (0.85 - Math.cos(sweepRad)) * 0.05);
    const CD = CD0 + CDi + waveDrag;

    const LD = CL / Math.max(1e-4, CD);
    const rootBendingStress = (CL * AR * 15) / (tThick * 120);

    return {
      AR,
      sweepDeg,
      tThick,
      mCamber,
      CL,
      CD,
      LD,
      rootBendingStress
    };
  }, [aspect, sweep, thickness, camber]);

  // Objective function to maximize L/D while penalizing root bending stress
  const wingObjective = (pAspect: number, pSweep: number, pThick: number, pCamber: number) => {
    const AR = 6 + pAspect * 8;
    const sweepRad = ((pSweep * 40) * Math.PI) / 180;
    const tThick = 0.06 + pThick * 0.16;
    const mCamber = 0.01 + pCamber * 0.06;

    const clAlpha = (2 * Math.PI * AR) / (AR + 2 * Math.cos(sweepRad));
    const CL = clAlpha * 0.08 + mCamber * 8.0;
    const CDi = (CL * CL) / (Math.PI * 0.85 * AR);
    const CD0 = 0.008 + 1.2 * (tThick * tThick);
    const waveDrag = Math.max(0, (0.85 - Math.cos(sweepRad)) * 0.05);
    const CD = CD0 + CDi + waveDrag;
    const LD = CL / Math.max(1e-4, CD);

    const rootStress = (CL * AR * 15) / (tThick * 120);
    const stressPenalty = rootStress > 120 ? Math.pow(rootStress - 120, 2) * 0.5 : 0;

    // We minimize negative L/D + penalty
    return -LD + stressPenalty;
  };

  // Run live CMA-ES Optimizer
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      setIsOptimizing(false);
      return;
    }
    setIsOptimizing(true);
    setOptGen(0);

    const optimizer = new CMAESOptimizer(
      (a, s) => {
        return wingObjective(a, s, thickness, camber);
      },
      {
        dim: 2,
        initialMean: [aspect, sweep],
        initialSigma: 0.25,
        lambda: 12,
        bounds: [0.0, 1.0]
      }
    );

    let g = 0;
    const maxG = 25;
    const interval = setInterval(() => {
      g++;
      const state = optimizer.step();
      setAspect(Math.max(0, Math.min(1, state.bestX[0])));
      setSweep(Math.max(0, Math.min(1, state.bestX[1])));
      setOptGen(g);

      if (g >= maxG) {
        clearInterval(interval);
        setIsOptimizing(false);
      }
    }, 180);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Wind Tunnel Canvas */}
        <div className="w-full lg:w-[65%] relative group aspect-[16/10] lg:aspect-auto lg:h-[480px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#020617]">
            <Canvas events={safePointerEvents} shadows dpr={[1, 2]} className="w-full h-full">
              <PerspectiveCamera makeDefault position={[4.2, 2.4, 4.5]} fov={38} />
              <color attach="background" args={["#020617"]} />
              <fog attach="fog" args={["#020617", 5, 20]} />

              <ambientLight intensity={0.3} />
              <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
              <pointLight position={[-8, -4, -6]} intensity={0.7} color="#38bdf8" />
              <Environment preset="city" />

              <group position={[0, -0.2, 0]}>
                <ParametricWingMesh
                  aspect={aspect}
                  sweep={sweep}
                  thickness={thickness}
                  camber={camber}
                />
                <CFDStreamlines speed={1.4} liftStrength={aero.CL} />
                <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -1.8, 0]} />
              </group>
            </Canvas>

            {/* Aerodynamic Telemetry Overlay */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 text-xs text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[0.65rem] text-slate-400">L/D Ratio:</span>
                <span className="font-mono font-bold text-sm text-cyan-200">{aero.LD.toFixed(2)}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 text-xs text-rose-300 border border-rose-500/30 backdrop-blur-md shadow-lg flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[0.65rem] text-slate-400">Drag Coeff (CD):</span>
                <span className="font-mono font-bold text-xs">{aero.CD.toFixed(4)}</span>
              </div>
            </div>

            {/* Live Optimizer HUD Badge */}
            {isOptimizing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-cyan-200">
                  CMA-ES Exploring Wing Geometry: Gen {optGen}/25
                </span>
              </div>
            )}

            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-950/60 text-[0.7rem] font-mono text-emerald-400 backdrop-blur-sm border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3D CFD Wind Tunnel Active</span>
            </div>
          </div>
        </div>

        {/* Aerodynamic Design Controls */}
        <div className="flex-1 space-y-6 w-full py-1">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
              <PlaneTakeoff className="h-4 w-4" />
              <span>Parametric Transonic Wing Controls</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore the aerodynamic trade-offs in real time: higher aspect ratio slashes induced drag (CDi ∝ 1/AR), while sweep angle delays shockwave formation at high subsonic Mach numbers.
            </p>
          </div>

          <div className="space-y-4 bg-slate-900/40 rounded-2xl p-5 border border-white/5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Aspect Ratio ($AR$)</span>
                <span className="text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {aero.AR.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={aspect}
                onChange={(e) => setAspect(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Sweep Angle ($\Lambda$)</span>
                <span className="text-blue-300 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {aero.sweepDeg.toFixed(1)}°
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={sweep}
                onChange={(e) => setSweep(parseFloat(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Airfoil Thickness ($t/c$)</span>
                <span className="text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {(aero.tThick * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value))}
                className="w-full accent-indigo-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">NACA Max Camber ($m$)</span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {(aero.mCamber * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={camber}
                onChange={(e) => setCamber(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunOptimizer}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all shadow-lg ${
              isOptimizing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] shadow-cyan-500/30"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isOptimizing ? "Stop Aerodynamic Optimization" : "Run Live CMA-ES Wing Optimization"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
