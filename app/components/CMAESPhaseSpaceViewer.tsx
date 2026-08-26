"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, OrbitControls, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CMAESGenerationStateND } from "../lib/cmaesEngineND";
import { Activity, Compass, Layers, Sparkles, Navigation } from "lucide-react";

const SCALE_FACTOR = 4.0;

/**
 * Renders the 3D Covariance Ellipsoid Mesh for the projected distribution N(0, sigma^2 C_3D)
 * with 1-sigma wireframe inner core and 2-sigma translucent confidence envelope.
 */
function EllipsoidMesh({
  radii,
  sigma
}: {
  radii: [number, number, number];
  sigma: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const outerHullRef = useRef<THREE.Mesh>(null);

  const targetScale1Sigma = useMemo(() => new THREE.Vector3(), []);
  const targetScale2Sigma = useMemo(() => new THREE.Vector3(), []);
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    targetScale1Sigma.set(
      Math.max(0.08, radii[0] * SCALE_FACTOR),
      Math.max(0.08, radii[1] * SCALE_FACTOR),
      Math.max(0.08, radii[2] * SCALE_FACTOR)
    );
    targetScale2Sigma.set(
      Math.max(0.16, radii[0] * SCALE_FACTOR * 2.0),
      Math.max(0.16, radii[1] * SCALE_FACTOR * 2.0),
      Math.max(0.16, radii[2] * SCALE_FACTOR * 2.0)
    );

    const lerpRate = Math.min(1, delta * 15);
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
          opacity={0.5}
          emissive="#38bdf8"
          emissiveIntensity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* 1-Sigma Wireframe Lattice */}
      <lineSegments ref={wireRef}>
        <wireframeGeometry args={[sphereGeom]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </lineSegments>

      {/* 2-Sigma Outer Confidence Shell */}
      <mesh ref={outerHullRef}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Renders 3D Principal Axis Vectors (Eigenvector directions)
 */
function PrincipalAxes({ radii }: { radii: [number, number, number] }) {
  const rX = Math.max(0.12, radii[0] * SCALE_FACTOR * 1.5);
  const rY = Math.max(0.12, radii[1] * SCALE_FACTOR * 1.5);
  const rZ = Math.max(0.12, radii[2] * SCALE_FACTOR * 1.5);

  const lineX = useMemo(() => [new THREE.Vector3(-rX, 0, 0), new THREE.Vector3(rX, 0, 0)], [rX]);
  const lineY = useMemo(() => [new THREE.Vector3(0, -rY, 0), new THREE.Vector3(0, rY, 0)], [rY]);
  const lineZ = useMemo(() => [new THREE.Vector3(0, 0, -rZ), new THREE.Vector3(0, 0, rZ)], [rZ]);

  return (
    <group position={[0, 0, 0]}>
      {/* PC1 Major Axis (Rose) */}
      <Line points={lineX} color="#f43f5e" lineWidth={2.8} />
      {/* PC2 Minor Axis (Emerald) */}
      <Line points={lineY} color="#34d399" lineWidth={2.8} />
      {/* PC3 Depth Axis (Sky) */}
      <Line points={lineZ} color="#38bdf8" lineWidth={2.8} />
    </group>
  );
}

/**
 * 3D Population Point Cloud with Elites Highlighted
 */
function PopulationCloud({ state }: { state: CMAESGenerationStateND }) {
  const instRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const samples = state.samples;
  const count = samples.length;

  useFrame(() => {
    if (!instRef.current) return;

    for (let i = 0; i < count; i++) {
      const s = samples[i];
      const p = s.projected3D;
      dummy.position.set(p[0] * SCALE_FACTOR, p[1] * SCALE_FACTOR, p[2] * SCALE_FACTOR);
      dummy.scale.setScalar(s.isElite ? 0.09 : 0.05);
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
  pSigma
}: {
  pC: [number, number, number];
  pSigma?: [number, number, number];
}) {
  const linePC = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pC[0] * SCALE_FACTOR * 0.8, pC[1] * SCALE_FACTOR * 0.8, pC[2] * SCALE_FACTOR * 0.8)
    ];
  }, [pC]);

  const linePSigma = useMemo(() => {
    if (!pSigma) return [];
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pSigma[0] * SCALE_FACTOR * 0.8, pSigma[1] * SCALE_FACTOR * 0.8, pSigma[2] * SCALE_FACTOR * 0.8)
    ];
  }, [pSigma]);

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
  if (!latestState) {
    return (
      <div className={`rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center text-xs text-slate-400 ${className}`}>
        Launch optimization to project internal covariance adaptation into 3D phase space.
      </div>
    );
  }

  const { phaseSpace3D, conditionNumber, sigma, generation, pC, pSigma, variancePerDim } = latestState;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl ${className}`}>
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
        <Canvas events={safePointerEvents} shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[2.6, 2.0, 3.4]} fov={42} />
          <color attach="background" args={["#030712"]} />

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-4, -4, -4]} intensity={0.6} color="#38bdf8" />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={1.6}
            maxDistance={8.0}
            target={[0, 0, 0]}
          />

          <group position={[0, 0, 0]}>
            {/* Coordinate Grid Planes */}
            <gridHelper args={[4, 8, "#1e293b", "#0f172a"]} position={[0, -1.2, 0]} />

            {/* Centered Distribution Mean Dot */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* 3D Covariance Ellipsoid */}
            <EllipsoidMesh
              radii={phaseSpace3D.ellipsoidRadii}
              sigma={sigma}
            />

            {/* Principal Axes Vectors */}
            <PrincipalAxes
              radii={phaseSpace3D.ellipsoidRadii}
            />

            {/* Candidate Offspring Population Cloud & Elites */}
            <PopulationCloud state={latestState} />

            {/* Evolution Paths (p_c & p_sigma) */}
            <EvolutionPaths
              pC={phaseSpace3D.evolutionPath3D}
              pSigma={phaseSpace3D.evolutionPathSigma3D}
            />
          </group>
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
