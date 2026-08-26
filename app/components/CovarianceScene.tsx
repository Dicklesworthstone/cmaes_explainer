"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { useRef, useMemo, useState, useEffect } from "react";
import { PerspectiveCamera, Float, Line, OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, FastForward, Sparkles, Sliders } from "lucide-react";

// --- 3D CMA-ES Mathematical Simulator for Hero ---

interface Point3D {
  x: number;
  y: number;
  z: number;
  fitness: number;
  isElite: boolean;
}

interface HeroGenerationState {
  gen: number;
  mean: [number, number, number];
  sigma: number;
  axes: [number, number, number]; // Ellipsoid radii along x, y, z
  rotation: [number, number, number]; // Euler angles
  samples: Point3D[];
  bestF: number;
  condNum: number;
}

function evaluate3D(x: number, y: number, z: number, landscape: "rosenbrock" | "cigar" | "rastrigin"): number {
  if (landscape === "cigar") {
    // Highly anisotropic curved trough
    return 100 * x * x + (y - x * x) ** 2 + 10 * z * z;
  }
  if (landscape === "rastrigin") {
    return (
      30 +
      (x * x - 10 * Math.cos(2 * Math.PI * x)) +
      (y * y - 10 * Math.cos(2 * Math.PI * y)) +
      (z * z - 10 * Math.cos(2 * Math.PI * z))
    );
  }
  // 3D Rosenbrock
  return 100 * (y - x * x) ** 2 + (1 - x) ** 2 + 100 * (z - y * y) ** 2 + (1 - y) ** 2;
}

function generateHeroTrajectory(landscape: "rosenbrock" | "cigar" | "rastrigin"): HeroGenerationState[] {
  const traj: HeroGenerationState[] = [];
  const maxGen = 45;
  let mean: [number, number, number] = [-1.4, 1.2, -0.8];
  let sigma = 0.65;
  let radii: [number, number, number] = [1.2, 0.9, 1.1];
  let rot: [number, number, number] = [0.1, 0.2, -0.1];
  const target: [number, number, number] = landscape === "rastrigin" ? [0, 0, 0] : [0.8, 0.6, 0.5];

  for (let g = 0; g <= maxGen; g++) {
    const t = g / maxGen;
    // Morph mean towards optimum along curved path
    const curMean: [number, number, number] = [
      mean[0] + (target[0] - mean[0]) * (1 - Math.exp(-3 * t)) + Math.sin(g * 0.4) * 0.04 * (1 - t),
      mean[1] + (target[1] - mean[1]) * (1 - Math.exp(-2.5 * t)) + Math.cos(g * 0.3) * 0.05 * (1 - t),
      mean[2] + (target[2] - mean[2]) * (1 - Math.exp(-2.8 * t))
    ];

    // Morph covariance radii: stretch into cigar, shrink sigma
    const rx = Math.max(0.2, radii[0] * (1 + 1.2 * t) * (1 - 0.5 * t));
    const ry = Math.max(0.12, radii[1] * Math.exp(-1.8 * t));
    const rz = Math.max(0.15, radii[2] * Math.exp(-1.4 * t));
    const curSigma = Math.max(0.15, sigma * Math.exp(-1.2 * t));

    // Rotate ellipsoid to align with valley trajectory
    const curRot: [number, number, number] = [
      rot[0] + t * 0.8 + Math.sin(t * Math.PI) * 0.3,
      rot[1] + t * 1.2,
      rot[2] + t * 0.5
    ];

    // Generate samples
    const samples: Point3D[] = [];
    const lambda = 24;
    for (let i = 0; i < lambda; i++) {
      // Gaussian in local coordinates
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 2;
      const w = (Math.random() - 0.5) * 2;
      const r = Math.cbrt(Math.random()) * curSigma;

      const lx = u * rx * r * 1.8;
      const ly = v * ry * r * 1.8;
      const lz = w * rz * r * 1.8;

      const px = curMean[0] + lx;
      const py = curMean[1] + ly;
      const pz = curMean[2] + lz;

      const fit = evaluate3D(px, py, pz, landscape);
      samples.push({ x: px, y: py, z: pz, fitness: fit, isElite: false });
    }

    samples.sort((a, b) => a.fitness - b.fitness);
    for (let i = 0; i < 8; i++) {
      samples[i].isElite = true;
    }

    const cond = rx / Math.min(ry, rz);

    traj.push({
      gen: g,
      mean: curMean,
      sigma: curSigma,
      axes: [rx, ry, rz],
      rotation: curRot,
      samples,
      bestF: samples[0].fitness,
      condNum: cond
    });
  }
  return traj;
}

// --- 3D Scene Subcomponents ---

function CovarianceEllipsoid({
  state
}: {
  state: HeroGenerationState;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeGeo = useMemo(() => new THREE.SphereGeometry(1, 24, 18), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
  });

  const [rx, ry, rz] = state.axes;

  return (
    <group position={state.mean} rotation={state.rotation}>
      {/* Semi-transparent glowing volume */}
      <mesh ref={meshRef} scale={[rx * 1.5, ry * 1.5, rz * 1.5]}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.1}
          transmission={0.7}
          thickness={0.5}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
        <lineSegments>
          <edgesGeometry args={[edgeGeo]} />
          <lineBasicMaterial color="#7dd3fc" transparent opacity={0.4} />
        </lineSegments>
      </mesh>

      {/* Principal Eigenvector Axes */}
      <line>
        <bufferGeometry
          setFromPoints={[
            new THREE.Vector3(-rx * 1.8, 0, 0),
            new THREE.Vector3(rx * 1.8, 0, 0)
          ]}
        />
        <lineBasicMaterial color="#38bdf8" linewidth={2} />
      </line>
      <line>
        <bufferGeometry
          setFromPoints={[
            new THREE.Vector3(0, -ry * 1.8, 0),
            new THREE.Vector3(0, ry * 1.8, 0)
          ]}
        />
        <lineBasicMaterial color="#a855f7" linewidth={2} />
      </line>
      <line>
        <bufferGeometry
          setFromPoints={[
            new THREE.Vector3(0, 0, -rz * 1.8),
            new THREE.Vector3(0, 0, rz * 1.8)
          ]}
        />
        <lineBasicMaterial color="#34d399" linewidth={2} />
      </line>

      {/* Center Mean Marker */}
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function PopulationSamples({ samples }: { samples: Point3D[] }) {
  const eliteMeshRef = useRef<THREE.InstancedMesh>(null);
  const otherMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const elites = useMemo(() => samples.filter((s) => s.isElite), [samples]);
  const others = useMemo(() => samples.filter((s) => !s.isElite), [samples]);

  useEffect(() => {
    if (eliteMeshRef.current) {
      elites.forEach((pt, i) => {
        dummy.position.set(pt.x, pt.y, pt.z);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        eliteMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      eliteMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (otherMeshRef.current) {
      others.forEach((pt, i) => {
        dummy.position.set(pt.x, pt.y, pt.z);
        dummy.scale.setScalar(0.7);
        dummy.updateMatrix();
        otherMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      otherMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [elites, others, dummy]);

  return (
    <group>
      {/* Elite Offspring - Glowing Emerald */}
      <instancedMesh
        ref={eliteMeshRef}
        args={[undefined as any, undefined as any, Math.max(1, elites.length)]}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Other Samples - Cyan/Purple */}
      <instancedMesh
        ref={otherMeshRef}
        args={[undefined as any, undefined as any, Math.max(1, others.length)]}
      >
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.65}
        />
      </instancedMesh>
    </group>
  );
}

function TrajectoryRibbon({ states, currentGen }: { states: HeroGenerationState[]; currentGen: number }) {
  const points = useMemo(() => {
    return states.slice(0, currentGen + 1).map((s) => new THREE.Vector3(...s.mean));
  }, [states, currentGen]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#38bdf8"
      lineWidth={2}
      dashed
      dashScale={5}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
}

// --- Main CovarianceScene Component ---

export function CovarianceScene() {
  const [landscape, setLandscape] = useState<"rosenbrock" | "cigar" | "rastrigin">("rosenbrock");
  const [isPlaying, setIsPlaying] = useState(true);
  const [genIndex, setGenIndex] = useState(0);

  const trajectory = useMemo(() => generateHeroTrajectory(landscape), [landscape]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setGenIndex((prev) => (prev + 1) % trajectory.length);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying, trajectory.length]);

  const currentState = trajectory[genIndex] || trajectory[0];

  return (
    <div className="relative h-full w-full flex flex-col justify-between">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          events={safePointerEvents}
          dpr={[1, 2]}
          camera={{ position: [2.8, 2.0, 3.6], fov: 38 }}
          className="h-full w-full"
        >
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 4, 18]} />
          
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 4]} intensity={1.5} color="#e0f2fe" />
          <pointLight position={[-4, -3, -4]} intensity={0.8} color="#38bdf8" />
          <pointLight position={[currentState.mean[0], currentState.mean[1] + 1, currentState.mean[2]]} intensity={2} color="#34d399" distance={4} />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={2.5}
            maxDistance={9}
            maxPolarAngle={Math.PI / 2 + 0.08}
            target={[0, 0, 0]}
          />

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
            <group position={[0, -0.2, 0]}>
              <CovarianceEllipsoid state={currentState} />
              <PopulationSamples samples={currentState.samples} />
              <TrajectoryRibbon states={trajectory} currentGen={genIndex} />
              
              {/* Subtle Grid Floor */}
              <gridHelper args={[10, 20, "#1e293b", "#0f172a"]} position={[0, -1.4, 0]} />
            </group>
          </Float>
        </Canvas>
      </div>

      {/* Top HUD: Diagnostics & Metric Gauges */}
      <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[0.7rem] font-mono font-bold text-slate-200">
              GEN {currentState.gen}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[0.68rem] font-mono text-sky-300">
            σ = {currentState.sigma.toFixed(3)}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[0.68rem] font-mono text-purple-300">
            κ(C) = {currentState.condNum.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto">
          {(["rosenbrock", "cigar", "rastrigin"] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLandscape(l);
                setGenIndex(0);
              }}
              className={`px-2.5 py-1 text-[0.65rem] font-semibold rounded-lg capitalize transition-all ${
                landscape === l
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {l === "rosenbrock" ? "Banana" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-4 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl border transition-all ${
                isPlaying
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setGenIndex((prev) => (prev + 1) % trajectory.length);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Step Next Generation"
            >
              <FastForward className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => {
                setGenIndex(0);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart from Gen 0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Generation Scrubber Slider */}
          <div className="flex-1 flex items-center gap-2 px-2">
            <input
              type="range"
              min={0}
              max={trajectory.length - 1}
              value={genIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setGenIndex(parseInt(e.target.value, 10));
              }}
              className="w-full h-1.5 bg-slate-800 accent-sky-400 rounded-lg cursor-pointer"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[0.68rem] text-slate-400 font-mono pr-2">
            <span className="text-emerald-400 font-bold">●</span> Top Elites
            <span className="text-sky-400 font-bold ml-2">●</span> Offspring
          </div>
        </div>
      </div>
    </div>
  );
}
