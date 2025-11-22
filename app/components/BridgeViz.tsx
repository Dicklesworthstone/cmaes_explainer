"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Deck({ span, stiffness, stress }: { span: number; stiffness: number; stress: number }) {
  const color = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL(0.33 - 0.25 * stress, 0.7, 0.5);
    return c;
  }, [stress]);
  return (
    <mesh position={[0, 0, 0]} scale={[span, 0.08 + stiffness * 0.05, 0.4]} receiveShadow>
      <boxGeometry args={[2, 0.2, 0.5]} />
      <meshStandardMaterial color={color} emissive={color.clone().multiplyScalar(0.15)} roughness={0.4} />
    </mesh>
  );
}

function Towers({ height }: { height: number }) {
  const h = 1.2 + height * 0.8;
  return (
    <group>
      <mesh position={[-1.1, h / 2, 0]} scale={[0.12, h, 0.25]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.15} roughness={0.5} />
      </mesh>
      <mesh position={[1.1, h / 2, 0]} scale={[0.12, h, 0.25]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.15} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Cables({ span, sag }: { span: number; sag: number }) {
  const points = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = THREE.MathUtils.lerp(-span, span, t);
      const y = 1.8 - sag * Math.pow(2 * t - 1, 2);
      p.push([x, y, 0]);
    }
    return p;
  }, [span, sag]);
  return <Line points={points} color="#38bdf8" lineWidth={2} dashed={false} />;
}

function StressOverlay({ stress }: { stress: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 0.15 * Math.sin(clock.getElapsedTime() * 2.0) * stress;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + pulse;
  });
  const color = new THREE.Color().setHSL(0.04 + 0.3 * stress, 0.75, 0.55);
  return (
    <mesh ref={ref} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.6, 0.7]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function MovingLoad({ span }: { span: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * 0.25) % 1;
    const x = THREE.MathUtils.lerp(-span + 0.2, span - 0.2, t);
    ref.current.position.set(x, 0.18, 0);
  });
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.06, 24, 24]} />
      <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.8} />
    </mesh>
  );
}

function WaterPlane() {
  return (
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 6]} />
      <meshStandardMaterial color="#0f172a" transparent opacity={0.8} />
    </mesh>
  );
}

function WindStreaks() {
  const count = 80;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      z: THREE.MathUtils.randFloatSpread(2.2),
      y: THREE.MathUtils.randFloat(0.6, 1.4),
      phase: Math.random() * Math.PI * 2,
      speed: THREE.MathUtils.randFloat(0.4, 0.9)
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const x = ((t * s.speed + s.phase) % 5) - 2.5;
      dummy.position.set(x, s.y, s.z);
      dummy.scale.set(0.04, 0.04, 0.5);
      dummy.rotation.z = Math.PI / 2;
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <boxGeometry args={[0.1, 0.1, 0.7]} />
      <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.7} />
    </instancedMesh>
  );
}

function CablePulse({ span, sag }: { span: number; sag: number }) {
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = THREE.MathUtils.lerp(-span, span, t);
      const y = 1.8 - sag * Math.pow(2 * t - 1, 2);
      arr.push([x, y, 0.01]);
    }
    return arr;
  }, [span, sag]);
  return <Line points={points} color="#f8fafc" lineWidth={1} dashed dashSize={0.15} gapSize={0.08} />;
}

export function BridgeViz() {
  const [span, setSpan] = useState(1.3);
  const [sag, setSag] = useState(0.45);
  const [load, setLoad] = useState(0.35);
  const [stiffness, setStiffness] = useState(0.5);

  const stress = useMemo(() => {
    const base = 0.2 + load * 0.6;
    const spanFactor = 0.4 * (span - 1.1);
    const sagRelief = 0.25 * (0.6 - sag);
    const stiffRelief = 0.3 * stiffness;
    return THREE.MathUtils.clamp(base + spanFactor - sagRelief - stiffRelief, 0, 1);
  }, [span, sag, load, stiffness]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="lg:w-[55%]">
          <Canvas shadows camera={{ position: [2.8, 1.8, 2.6], fov: 45 }} className="h-80 w-full">
            <color attach="background" args={["#030712"]} />
            <fog attach="fog" args={["#030712", 6, 12]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow color="#cddff8" />
            <directionalLight position={[-2, 3, -2]} intensity={0.6} color="#f472b6" />
            <WaterPlane />
            <group position={[0, 0, 0]}>
              <Towers height={0.4 + span * 0.2} />
              <Deck span={span} stiffness={stiffness} stress={stress} />
              <Cables span={span} sag={sag} />
              <StressOverlay stress={stress} />
              <MovingLoad span={span} />
              <CablePulse span={span} sag={sag} />
            </group>
            <WindStreaks />
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />
          </Canvas>
        </div>
        <div className="flex-1 space-y-3 text-[0.8rem] text-slate-200">
          <div className="text-[0.75rem] uppercase tracking-wide text-sky-200">Bridge knobs</div>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Span</span>
              <span className="text-slate-200">{(300 + span * 120).toFixed(0)} m</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={1.6}
              step={0.01}
              value={span}
              onChange={(e) => setSpan(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Cable sag</span>
              <span className="text-slate-200">{(sag * 100).toFixed(0)} m</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={0.7}
              step={0.01}
              value={sag}
              onChange={(e) => setSag(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Deck stiffness</span>
              <span className="text-slate-200">{(stiffness * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.01}
              value={stiffness}
              onChange={(e) => setStiffness(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Load case (wind/live)</span>
              <span className="text-slate-200">{(load * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={load}
              onChange={(e) => setLoad(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </label>
          <p className="text-slate-400">
            Color overlay is a toy stress proxy: higher span + load push it toward red; sag and
            stiffness pull it back toward green. The idea mirrors the “bridge via FEA” card—few knobs,
            nonlinear modes, and no gradients you trust.
          </p>
        </div>
      </div>
    </div>
  );
}
