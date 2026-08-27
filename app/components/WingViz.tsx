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
  Wind,
  PlaneTakeoff,
  Gauge,
  Activity,
  Compass,
  Layers,
  Sliders,
  Eye,
  Info
} from "lucide-react";
import {
  WingParams,
  AirfoilFamily,
  WING_PARAM_SPECS,
  evaluateWingPhysics,
  decodeParameter,
  encodeParameter,
  initFrankenSim
} from "../lib/frankensimPhysics";
import { CMAESOptimizerND, CMAESGenerationStateND } from "../lib/cmaesEngineND";
import { FrankenSimBadge } from "./FrankenSimBadge";
import { CMAESPhaseSpaceViewer, CMAESTelemetryHUD } from "./CMAESPhaseSpaceViewer";

// --- NACA & Parametric Airfoil 3D Geometry Generator ---

function getNacaShape(
  m: number,
  p: number,
  t: number,
  family: AirfoilFamily,
  chord: number = 1.4,
  points = 80
): THREE.Shape {
  const shape = new THREE.Shape();
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  // Supercritical and reflex modifications
  const isSupercritical = family === "Supercritical SC(2)";
  const isReflexed = family === "Reflexed Flying Wing";
  const isHighLift = family === "NACA 5-Digit High-Lift";
  const isLaminar = family === "Laminar Flow Low-Re";

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * chord;
    let yc = 0;
    let dyc_dx = 0;

    if (p > 0 && m > 0) {
      // NACA 4-digit camber line; yc carries the chord factor so the drawn
      // camber matches the dimensionless m the sliders set.
      if (x <= p * chord) {
        yc = chord * (m / (p * p)) * (2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / (p * p)) * (p - x / chord);
      } else {
        yc = chord * (m / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / ((1 - p) ** 2)) * (p - x / chord);
      }
    }

    if (isReflexed && x > 0.75 * chord) {
      yc -= 0.03 * chord * ((x - 0.75 * chord) / (0.25 * chord));
    }
    if (isHighLift) yc *= 1.15;

    // NACA 4-digit thickness: y_t = 5 t c (...), so a t/c slider setting of
    // 0.12 renders as a true 12% section at this chord.
    let yt =
      5 *
      t *
      chord *
      (0.2969 * Math.sqrt(Math.max(0, x / chord)) -
        0.126 * (x / chord) -
        0.3516 * (x / chord) ** 2 +
        0.2843 * (x / chord) ** 3 -
        0.1015 * (x / chord) ** 4);

    if (isSupercritical) {
      // Flattened upper surface for delayed shockwave
      yt = yt * (1 - 0.15 * Math.sin((x / chord) * Math.PI));
    } else if (isLaminar) {
      // Schematic aft-loaded thickness, without claiming a specific NACA
      // 6-series coordinate table.
      yt *= 0.88 + 0.22 * Math.sin(Math.PI * (x / chord)) ** 2;
    }

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
  aspectRatio,
  sweepAngle,
  thicknessRatio,
  maxCamber,
  camberPosition,
  taperRatio,
  airfoilFamily,
  internalRibCount
}: WingParams) {
  const meshRef = useRef<THREE.Group>(null);

  const m = maxCamber;
  const p = camberPosition;
  const t = thicknessRatio;
  const span = 1.4 + (aspectRatio / 16) * 3.2;

  const geometry = useMemo(() => {
    const shape = getNacaShape(m, p, t, airfoilFamily, 1.4);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: span,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      steps: 8
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    // Apply taper and sweep across span (z axis)
    const pos = geom.attributes.position;
    const sweepSkew = (sweepAngle / 45) * 1.35;
    for (let i = 0; i < pos.count; i++) {
      const zVal = pos.getZ(i);
      const spanNorm = Math.abs(zVal) / (span / 2);
      const currentX = pos.getX(i);
      const currentY = pos.getY(i);

      // Taper is a chord ratio (tip/root), so it shrinks the local chord (X)
      // toward the tip, with section thickness (Y) scaling proportionally;
      // sweep then skews the tapered section AFT (+X = downstream, the
      // direction the CFD streamlines travel), like a real swept wing.
      const scaleFactor = 1.0 - spanNorm * (1.0 - taperRatio) * 0.7;
      pos.setX(i, currentX * scaleFactor + spanNorm * sweepSkew);
      pos.setY(i, currentY * scaleFactor);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, [m, p, t, span, sweepAngle, taperRatio, airfoilFamily]);

  const ribs = useMemo(() => {
    const sweepSkew = (sweepAngle / 45) * 1.35;
    return Array.from({ length: internalRibCount }, (_, index) => {
      const spanFraction = (index + 1) / (internalRibCount + 1) - 0.5;
      const spanNorm = Math.abs(spanFraction) * 2;
      const scaleFactor = 1.0 - spanNorm * (1.0 - taperRatio) * 0.7;
      return {
        x: spanNorm * sweepSkew,
        z: spanFraction * span,
        chord: 1.4 * scaleFactor
      };
    });
  }, [internalRibCount, span, sweepAngle, taperRatio]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
      {/* No rotation: the airfoil section lives in the XY plane (chord along
          X, the streamline axis; thickness along Y) and the span extrudes
          along Z — a wing lying in the flow. The old [π/2,0,0] rotation
          stood the span up vertically like a sail. Moderate metalness: at
          0.85 with no environment map the PBR material reflected nothing
          and the wing rendered as a black silhouette, which made slider and
          optimizer geometry changes invisible. */}
      <group ref={meshRef}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#e2e8f0"
            metalness={0.35}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.12}
            reflectivity={1}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Surface-visible schematic rib stations make the optimized
            structural-mass coordinate perceptible in the model. */}
        {ribs.map((rib, index) => (
          <mesh key={index} position={[rib.x, 0.035, rib.z]}>
            <boxGeometry args={[rib.chord, 0.012, 0.014]} />
            <meshStandardMaterial color="#f59e0b" emissive="#92400e" emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>
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
    return Array.from({ length: count }, (_, i) => {
      const s1 = Math.sin(i * 12.9898 + 1.234) * 43758.5453;
      const s2 = Math.sin(i * 78.233 + 4.567) * 43758.5453;
      const s3 = Math.sin(i * 39.346 + 9.876) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3);
      return {
        x: (r1 - 0.5) * 12,
        y: (r2 - 0.5) * 4.5,
        z: (r3 - 0.5) * 6.5,
        speed: 0.8 + r1 * 0.6
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.x += p.speed * speed * 7.5 * delta;

      if (p.x > 6) {
        p.x = -6;
        const s2 = Math.sin(i * 78.233 + p.x) * 43758.5453;
        const s3 = Math.sin(i * 39.346 + p.x) * 43758.5453;
        p.y = (s2 - Math.floor(s2) - 0.5) * 4.5;
        p.z = (s3 - Math.floor(s3) - 0.5) * 6.5;
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

      // Decorative height-based tint (no pressure field is computed):
      // upper streamlines shift toward green, lower ones toward cyan.
      const heightNorm = Math.max(0, Math.min(1, 0.5 + p.y / 2.0));
      tempColor.setHSL(0.55 - heightNorm * 0.2, 0.9, 0.6);

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

// --- Main Interactive WingViz Component ---

function decodeWingVector(v: number[]): WingParams {
  return {
    aspectRatio: Number(decodeParameter(v[0], WING_PARAM_SPECS[0]).value),
    sweepAngle: Number(decodeParameter(v[1], WING_PARAM_SPECS[1]).value),
    thicknessRatio: Number(decodeParameter(v[2], WING_PARAM_SPECS[2]).value),
    maxCamber: Number(decodeParameter(v[3], WING_PARAM_SPECS[3]).value),
    camberPosition: Number(decodeParameter(v[4], WING_PARAM_SPECS[4]).value),
    taperRatio: Number(decodeParameter(v[5], WING_PARAM_SPECS[5]).value),
    airfoilFamily: String(decodeParameter(v[6], WING_PARAM_SPECS[6]).value) as AirfoilFamily,
    internalRibCount: Number(decodeParameter(v[7], WING_PARAM_SPECS[7]).value)
  };
}

export function WingViz() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(canvasContainerRef, { rootMargin: "250px 0px 250px 0px" });

  // 8 Physical Input Parameters
  const [params, setParams] = useState<WingParams>({
    aspectRatio: 10.6,
    sweepAngle: 25.0,
    thicknessRatio: 0.12,
    maxCamber: 0.036,
    camberPosition: 0.4,
    taperRatio: 0.56,
    airfoilFamily: "Supercritical SC(2)",
    internalRibCount: 22
  });

  const [isExpanded3D, setIsExpanded3D] = useState(false);

  // CMA-ES State with lazy initialization
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);
  const [latestStateND, setLatestStateND] = useState<CMAESGenerationStateND | null>(null);
  const [historyND, setHistoryND] = useState<CMAESGenerationStateND[]>([]);
  const optIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyManualParams = useCallback((next: WingParams) => {
    if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    setIsOptimizing(false);
    setOptGen(0);
    setLatestStateND(null);
    setHistoryND([]);
    setParams(next);
  }, []);

  // Convert 8 parameters to/from [0, 1]^8 unit cube
  const paramVector = useMemo(() => {
    return [
      encodeParameter(params.aspectRatio, WING_PARAM_SPECS[0]),
      encodeParameter(params.sweepAngle, WING_PARAM_SPECS[1]),
      encodeParameter(params.thicknessRatio, WING_PARAM_SPECS[2]),
      encodeParameter(params.maxCamber, WING_PARAM_SPECS[3]),
      encodeParameter(params.camberPosition, WING_PARAM_SPECS[4]),
      encodeParameter(params.taperRatio, WING_PARAM_SPECS[5]),
      encodeParameter(params.airfoilFamily, WING_PARAM_SPECS[6]),
      encodeParameter(params.internalRibCount, WING_PARAM_SPECS[7])
    ];
  }, [params]);

  // Decode unit vector [0, 1]^8 back to physical WingParams
  const decodeVectorToParams = useCallback((v: number[]): WingParams => {
    return decodeWingVector(v);
  }, []);

  // The FrankenSim WASM kernel loads asynchronously; without this readiness
  // flag in the memo deps the displayed numbers would stay TS-computed until
  // the next slider move, while the badge already claims the kernel is live.
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

  // Real aerodynamic physics analysis output
  const aero = useMemo(() => {
    void fsPhysicsReady;
    return evaluateWingPhysics(params, 0.78);
  }, [params, fsPhysicsReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    };
  }, []);

  // Run live 8D CMA-ES Optimization with 3D PCA Phase-Space projection
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
      setIsOptimizing(false);
      return;
    }

    setIsOptimizing(true);
    setOptGen(0);
    setLatestStateND(null);
    setHistoryND([]);

    const optimizer = new CMAESOptimizerND(
      (zVec) => {
        const decoded = decodeVectorToParams(zVec);
        const result = evaluateWingPhysics(decoded, 0.78);
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
      // Animate the distribution center so every generation visibly advances;
      // land on the best-ever design when the run completes.
      const displayedVector = g >= maxG ? state.bestX : state.mean;
      setParams(decodeVectorToParams(displayedVector));
      setOptGen(g);
      setLatestStateND(state);
      setHistoryND((prev) => [...prev, state]);

      if (g >= maxG) {
        if (optIntervalRef.current) clearInterval(optIntervalRef.current);
        setIsOptimizing(false);
      }
    }, 180);
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      {/* Top Header with FrankenSim Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <PlaneTakeoff className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Transonic Wing Aerodynamic & Structural Multi-Parameter Optimization
            </h3>
            <p className="text-xs text-slate-400">
              8-Dimensional Mixed Continuous & Discrete Parameter Evolution
            </p>
          </div>
        </div>

        {/* FrankenSim.org Physics Badge */}
        <FrankenSimBadge />
      </div>

      {/* Main Grid: 3D Viewport / Phase Space & Control Panel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3D Wind Tunnel Container */}
        <div className="lg:w-[62%] w-full min-w-0 space-y-4">
          {/* Main 3D Canvas Stage (Single or Split 3D View) */}
          {isExpanded3D ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 3D Physical Wing CFD Canvas */}
              <div ref={canvasContainerRef} className="relative group aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#020617]">
                <Canvas
                  events={safePointerEvents}
                  shadows
                  dpr={[1, 2]}
                  frameloop={isInView ? "always" : "demand"}
                  className="w-full h-full"
                >
                  <PerspectiveCamera makeDefault position={[3.2, 1.9, 4.2]} fov={38} />
                  <color attach="background" args={["#020617"]} />
                  <fog attach="fog" args={["#020617", 5, 20]} />

                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
                  <pointLight position={[-8, -4, -6]} intensity={0.7} color="#38bdf8" />
                  <directionalLight position={[0, 10, 0]} intensity={0.7} color="#bae6fd" />

                  <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={2.8}
                    maxDistance={12}
                    maxPolarAngle={Math.PI / 2 + 0.05}
                    target={[0, 0, 0]}
                  />

                  <group position={[0, -0.2, 0]}>
                    <ParametricWingMesh {...params} />
                    <CFDStreamlines speed={1.4} liftStrength={aero.liftCoeffCL} />
                    <gridHelper args={[24, 24, "#1e293b", "#0f172a"]} position={[0, -1.8, 0]} />
                  </group>
                </Canvas>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 text-[0.62rem] font-bold text-cyan-300 backdrop-blur-md">
                  3D Physical Airfoil
                </div>

                {/* Aerodynamic Telemetry Overlay */}
                <div className="absolute bottom-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                  <div className="px-2 py-0.5 rounded-lg bg-slate-950/85 text-[0.62rem] text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold uppercase text-[0.55rem]">L/D:</span>
                    <span className="font-mono font-bold text-cyan-200">{aero.liftToDragRatio.toFixed(2)}</span>
                  </div>
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
            <div ref={canvasContainerRef} className="relative group aspect-[16/10] sm:aspect-auto lg:h-[460px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#020617]">
              <Canvas
                events={safePointerEvents}
                shadows
                dpr={[1, 2]}
                frameloop={isInView ? "always" : "demand"}
                className="w-full h-full"
              >
                <PerspectiveCamera makeDefault position={[3.2, 1.9, 4.2]} fov={38} />
                <color attach="background" args={["#020617"]} />
                <fog attach="fog" args={["#020617", 5, 20]} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-8, -4, -6]} intensity={0.7} color="#38bdf8" />
                <directionalLight position={[0, 10, 0]} intensity={0.7} color="#bae6fd" />

                <OrbitControls
                  makeDefault
                  enableDamping
                  dampingFactor={0.06}
                  minDistance={2.8}
                  maxDistance={12}
                  maxPolarAngle={Math.PI / 2 + 0.05}
                  target={[0, 0, 0]}
                />

                <group position={[0, -0.2, 0]}>
                  <ParametricWingMesh {...params} />
                  <CFDStreamlines speed={1.4} liftStrength={aero.liftCoeffCL} />
                  <gridHelper args={[24, 24, "#1e293b", "#0f172a"]} position={[0, -1.8, 0]} />
                </group>
              </Canvas>

              {/* Orbit hint */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[0.62rem] sm:text-[0.68rem] font-mono text-slate-300 pointer-events-none shadow-lg">
                <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" />
                <span>Drag to orbit 3D model</span>
              </div>

              {/* Aerodynamic Telemetry Overlay (desktop only: with the Mach
                  box it blankets a phone-width canvas; mobile shows the same
                  numbers in the strip under the viewport) */}
              <div className="hidden sm:flex absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex-col gap-1 sm:gap-1.5 pointer-events-none">
                <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950/85 text-xs text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold uppercase tracking-wider text-[0.6rem] sm:text-[0.65rem] text-slate-400">L/D Ratio:</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-cyan-200">{aero.liftToDragRatio.toFixed(2)}</span>
                </div>
                <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950/85 text-xs text-rose-300 border border-rose-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold uppercase tracking-wider text-[0.6rem] sm:text-[0.65rem] text-slate-400">Drag (CD):</span>
                  <span className="font-mono font-bold text-[0.68rem] sm:text-xs">{aero.dragCoeffCD.toFixed(4)}</span>
                </div>
              </div>

              {/* Critical Mach Indicator (desktop only; see mobile strip) */}
              <div className="hidden sm:block absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950/85 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md shadow-xl pointer-events-none">
                <div className="text-[0.58rem] sm:text-[0.65rem] uppercase text-slate-400">Critical Mach</div>
                <div className="font-bold text-sky-400 text-xs sm:text-sm">{aero.criticalMach.toFixed(2)} M</div>
              </div>
            </div>
          )}

          {/* Mobile aero telemetry strip (replaces the in-viewport overlays) */}
          <div className="sm:hidden flex flex-wrap items-center gap-x-4 gap-y-1 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-[0.68rem] font-mono text-slate-300">
            <span>
              <span className="text-slate-500 uppercase text-[0.6rem]">L/D</span>{" "}
              <span className="font-bold text-cyan-200">{aero.liftToDragRatio.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-slate-500 uppercase text-[0.6rem]">CD</span>{" "}
              <span className="font-bold text-rose-300">{aero.dragCoeffCD.toFixed(4)}</span>
            </span>
            <span>
              <span className="text-slate-500 uppercase text-[0.6rem]">Crit Mach</span>{" "}
              <span className="font-bold text-sky-400">{aero.criticalMach.toFixed(2)} M</span>
            </span>
          </div>

          {/* Unified Live CMA-ES Internal State Telemetry HUD (Directly at the bottom) */}
          <CMAESTelemetryHUD
            latestState={latestStateND}
            history={historyND}
            isOptimizing={isOptimizing}
            maxGen={25}
            onToggleExpand3D={() => setIsExpanded3D((prev) => !prev)}
            isExpanded3D={isExpanded3D}
            accentColor="cyan"
            objectiveName="Aero Cost"
          />
        </div>

        {/* 8-Parameter Control Panel */}
        <div className="flex-1 space-y-5 w-full">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-between">
              <span>Transonic Wing Parameters</span>
              <span className="font-mono text-[0.68rem] text-slate-400">8D Parameter Space</span>
            </div>
            <p className="text-xs text-slate-300">
              CMA-ES searches continuous geometry, sweep angles, and discrete airfoil families.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  applyManualParams({
                    aspectRatio: 11.6,
                    sweepAngle: 28.0,
                    thicknessRatio: 0.11,
                    maxCamber: 0.032,
                    camberPosition: 0.42,
                    taperRatio: 0.52,
                    airfoilFamily: "Supercritical SC(2)",
                    internalRibCount: 24
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                ✈️ Commercial Airliner
              </button>
              <button
                type="button"
                onClick={() =>
                  applyManualParams({
                    aspectRatio: 7.2,
                    sweepAngle: 38.0,
                    thicknessRatio: 0.08,
                    maxCamber: 0.015,
                    camberPosition: 0.35,
                    taperRatio: 0.42,
                    airfoilFamily: "Laminar Flow Low-Re",
                    internalRibCount: 18
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                🚀 High-Speed Transonic
              </button>
              <button
                type="button"
                onClick={() =>
                  applyManualParams({
                    aspectRatio: 15.5,
                    sweepAngle: 8.0,
                    thicknessRatio: 0.16,
                    maxCamber: 0.065,
                    camberPosition: 0.45,
                    taperRatio: 0.7,
                    airfoilFamily: "NACA 4-Digit Conventional",
                    internalRibCount: 32
                  })
                }
                className="text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                🪂 High-Lift Glider
              </button>
            </div>
          </div>

          <div className="space-y-3.5 bg-slate-900/50 rounded-2xl p-4 border border-white/5 max-h-[440px] overflow-y-auto pr-2">
            {/* 1. Aspect Ratio */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[0].label}</span>
                <span className="text-cyan-300 font-mono text-xs">{params.aspectRatio.toFixed(1)}</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[0].label}
                min={WING_PARAM_SPECS[0].min}
                max={WING_PARAM_SPECS[0].max}
                step={WING_PARAM_SPECS[0].step}
                value={params.aspectRatio}
                onChange={(e) => applyManualParams({ ...params, aspectRatio: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* 2. Sweep Angle */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[1].label}</span>
                <span className="text-blue-300 font-mono text-xs">{params.sweepAngle.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[1].label}
                min={WING_PARAM_SPECS[1].min}
                max={WING_PARAM_SPECS[1].max}
                step={WING_PARAM_SPECS[1].step}
                value={params.sweepAngle}
                onChange={(e) => applyManualParams({ ...params, sweepAngle: parseFloat(e.target.value) })}
                className="w-full accent-blue-400"
              />
            </div>

            {/* 3. Thickness Ratio */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[2].label}</span>
                <span className="text-indigo-300 font-mono text-xs">{(params.thicknessRatio * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[2].label}
                min={WING_PARAM_SPECS[2].min}
                max={WING_PARAM_SPECS[2].max}
                step={WING_PARAM_SPECS[2].step}
                value={params.thicknessRatio}
                onChange={(e) => applyManualParams({ ...params, thicknessRatio: parseFloat(e.target.value) })}
                className="w-full accent-indigo-400"
              />
            </div>

            {/* 4. Max Camber */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[3].label}</span>
                <span className="text-purple-300 font-mono text-xs">{(params.maxCamber * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[3].label}
                min={WING_PARAM_SPECS[3].min}
                max={WING_PARAM_SPECS[3].max}
                step={WING_PARAM_SPECS[3].step}
                value={params.maxCamber}
                onChange={(e) => applyManualParams({ ...params, maxCamber: parseFloat(e.target.value) })}
                className="w-full accent-purple-400"
              />
            </div>

            {/* 5. Camber Position */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[4].label}</span>
                <span className="text-teal-300 font-mono text-xs">{(params.camberPosition * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[4].label}
                min={WING_PARAM_SPECS[4].min}
                max={WING_PARAM_SPECS[4].max}
                step={WING_PARAM_SPECS[4].step}
                value={params.camberPosition}
                onChange={(e) => applyManualParams({ ...params, camberPosition: parseFloat(e.target.value) })}
                className="w-full accent-teal-400"
              />
            </div>

            {/* 6. Taper Ratio */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[5].label}</span>
                <span className="text-rose-300 font-mono text-xs">{params.taperRatio.toFixed(2)}</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[5].label}
                min={WING_PARAM_SPECS[5].min}
                max={WING_PARAM_SPECS[5].max}
                step={WING_PARAM_SPECS[5].step}
                value={params.taperRatio}
                onChange={(e) => applyManualParams({ ...params, taperRatio: parseFloat(e.target.value) })}
                className="w-full accent-rose-400"
              />
            </div>

            {/* 7. Categorical Airfoil Family */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Airfoil Family</span>
                <span className="text-sky-300 font-mono text-[0.68rem]">{params.airfoilFamily}</span>
              </div>
              <select
                aria-label="Airfoil Family"
                value={params.airfoilFamily}
                onChange={(e) => applyManualParams({ ...params, airfoilFamily: e.target.value as AirfoilFamily })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {WING_PARAM_SPECS[6].categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Discrete Rib Count */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{WING_PARAM_SPECS[7].label}</span>
                <span className="text-amber-300 font-mono text-xs">{params.internalRibCount} ribs</span>
              </div>
              <input
                type="range"
                aria-label={WING_PARAM_SPECS[7].label}
                min={WING_PARAM_SPECS[7].min}
                max={WING_PARAM_SPECS[7].max}
                step={WING_PARAM_SPECS[7].step}
                value={params.internalRibCount}
                onChange={(e) => applyManualParams({ ...params, internalRibCount: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRunOptimizer}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-[background-color,box-shadow,transform] shadow-lg ${
              isOptimizing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] shadow-cyan-500/30"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isOptimizing ? "Stop Aerodynamic Optimization" : "Run 8D CMA-ES Wing Optimization"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
