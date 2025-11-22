"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, Environment } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function WingBody({ aspect, sweep, thickness }: { aspect: number; sweep: number; thickness: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.degToRad(sweep * 30 - 15);
    ref.current.rotation.x = THREE.MathUtils.degToRad(1.5 * Math.sin(clock.getElapsedTime() * 0.35));
  });

  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.quadraticCurveTo(-0.2, 0.35, 1.05, 0);
    shape.quadraticCurveTo(-0.2, -0.35, -1, 0);
    const extrudeSettings = { depth: 0.4 + thickness * 0.25, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 4, steps: 1 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings).center();
  }, [thickness]);

  const color = useMemo(() => new THREE.Color().setHSL(0.55, 0.65, 0.55), []);
  return (
    <mesh ref={ref} geometry={geom} scale={[1.1 + aspect * 1.2, 0.9, 0.85]} castShadow>
      <meshStandardMaterial color={color} metalness={0.35} roughness={0.3} envMapIntensity={1.2} />
    </mesh>
  );
}

function FlowField({ speed = 0.35 }: { speed?: number }) {
  const count = 80;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      z: THREE.MathUtils.randFloatSpread(2.5),
      y: THREE.MathUtils.randFloatSpread(0.8),
      phase: Math.random() * Math.PI * 2,
      scale: THREE.MathUtils.randFloat(0.12, 0.55)
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    offsets.forEach((o, i) => {
      const x = ((t * speed + o.phase) % 4) - 2;
      dummy.position.set(x, o.y, o.z);
      dummy.scale.setScalar(o.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <coneGeometry args={[0.05, 0.2, 6]} />
      <meshStandardMaterial color="#c4f1f9" emissive="#22d3ee" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

function SparkTrails() {
  const count = 60;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      z: THREE.MathUtils.randFloatSpread(1.5),
      y: THREE.MathUtils.randFloatSpread(0.6),
      phase: Math.random() * Math.PI * 2,
      speed: THREE.MathUtils.randFloat(0.15, 0.45)
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const x = ((t * s.speed + s.phase) % 3.2) - 1.6;
      dummy.position.set(x, s.y + Math.sin(t * 1.3 + s.phase) * 0.05, s.z);
      dummy.scale.set(0.04, 0.04, 0.28);
      dummy.rotation.z = Math.PI / 2;
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <boxGeometry args={[0.12, 0.12, 0.6]} />
      <meshStandardMaterial color="#f8fafc" emissive="#f59e0b" emissiveIntensity={0.9} />
    </instancedMesh>
  );
}

function HaloGlow() {
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.05} />
    </mesh>
  );
}

function VortexParticles() {
  const count = 140;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      r: THREE.MathUtils.randFloat(0.6, 1.4),
      y: THREE.MathUtils.randFloatSpread(0.9),
      phase: Math.random() * Math.PI * 2,
      speed: THREE.MathUtils.randFloat(0.4, 0.8)
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const ang = t * s.speed + s.phase;
      const x = Math.cos(ang) * s.r;
      const z = Math.sin(ang) * s.r;
      dummy.position.set(x, s.y, z);
      dummy.scale.setScalar(0.03);
      dummy.lookAt(0, s.y, 0);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={0.6} roughness={0.6} />
    </instancedMesh>
  );
}

export function WingViz() {
  const [aspect, setAspect] = useState(0.55);
  const [sweep, setSweep] = useState(0.4);
  const [thickness, setThickness] = useState(0.5);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="lg:w-[55%]">
          <Canvas shadows camera={{ position: [4, 2.2, 4], fov: 45 }} className="h-80 w-full">
            <color attach="background" args={["#04091b"]} />
            <fog attach="fog" args={["#04091b", 4, 10]} />
            <Environment preset="studio" />
            <Stage intensity={0.95} environment={null} preset="soft" shadows="contact">
              <group position={[0, -0.2, 0]}>
                <WingBody aspect={aspect} sweep={sweep} thickness={thickness} />
                <FlowField />
                <SparkTrails />
                <VortexParticles />
                <HaloGlow />
              </group>
            </Stage>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
          </Canvas>
        </div>
        <div className="flex-1 space-y-3 text-[0.8rem] text-slate-200">
          <div className="text-[0.75rem] uppercase tracking-wide text-sky-200">Airfoil toy knobs</div>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Aspect ratio</span>
              <span className="text-slate-200">{(6 + aspect * 6).toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={aspect}
              onChange={(e) => setAspect(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Sweep</span>
              <span className="text-slate-200">{(sweep * 40).toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sweep}
              onChange={(e) => setSweep(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Thickness / twist proxy</span>
              <span className="text-slate-200">{(0.1 + thickness * 0.25).toFixed(2)}c</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={thickness}
              onChange={(e) => setThickness(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <p className="text-slate-400">
            Sliders map to the same normalized box used in the walkthrough. The arrows are a toy flow
            field; as aspect and sweep change, the “wing” and flow alignment shift to hint at why CMA-ES
            learns a metric instead of just shrinking σ.
          </p>
        </div>
      </div>
    </div>
  );
}
