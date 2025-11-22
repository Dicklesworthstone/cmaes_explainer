"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Line } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function NodeSphere({ position, intensity }: { position: THREE.Vector3; intensity: number }) {
  const color = useMemo(() => new THREE.Color().setHSL(0.58, 0.7, 0.55), []);
  return (
    <mesh position={position.toArray()}>
      <sphereGeometry args={[0.08 + intensity * 0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9 + intensity * 0.8} roughness={0.35} metalness={0.2} />
    </mesh>
  );
}

function EdgeRibbon({ a, b, weight }: { a: THREE.Vector3; b: THREE.Vector3; weight: number }) {
  const points = useMemo(() => {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.12, 0));
    return new THREE.CatmullRomCurve3([a, mid, b]).getPoints(25).map((p) => p.toArray());
  }, [a, b]);
  const color = new THREE.Color().setHSL(0.08 + 0.4 * weight, 0.8, 0.55).getStyle();
  return <Line points={points} color={color} lineWidth={1} dashed dashSize={0.2} gapSize={0.12} />;
}

function LayerStack({ depth, width, heads }: { depth: number; width: number; heads: number }) {
  const nodes: THREE.Vector3[] = [];
  const edges: { a: THREE.Vector3; b: THREE.Vector3; weight: number }[] = [];
  const layers = depth;
  const perLayer = Math.max(4, Math.round(4 + width * 4));
  const spread = 1.8;

  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < perLayer; i++) {
      const x = (i / (perLayer - 1) - 0.5) * spread * (0.7 + 0.3 * width);
      const y = 0.35 * Math.sin((i / (perLayer - 1)) * Math.PI * 2 + l * 0.5);
      const z = (l / (layers - 1) - 0.5) * 2.2;
      nodes.push(new THREE.Vector3(x, y, z));
    }
  }

  for (let l = 0; l < layers - 1; l++) {
    const offset = l * perLayer;
    for (let i = 0; i < perLayer; i++) {
      for (let j = 0; j < perLayer; j++) {
        const a = nodes[offset + i];
        const b = nodes[offset + perLayer + j];
        const weight = 0.3 + 0.6 * Math.random();
        edges.push({ a, b, weight });
      }
    }
  }

  const headGlowCount = Math.max(1, Math.round(heads * 6));
  const headParticles = useMemo(() => Array.from({ length: headGlowCount }, () => ({
    idx: Math.floor(Math.random() * nodes.length),
    phase: Math.random() * Math.PI * 2,
    speed: THREE.MathUtils.randFloat(0.4, 0.9)
  })), [nodes.length, headGlowCount]);

  return (
    <group>
      {edges.map((e, i) => (
        <EdgeRibbon key={i} a={e.a} b={e.b} weight={e.weight} />
      ))}
      {nodes.map((n, i) => (
        <NodeSphere key={i} position={n} intensity={Math.random() * 0.6 + 0.2} />
      ))}
      {headParticles.map((h, i) => (
        <HeadGlow key={i} node={nodes[h.idx]} phase={h.phase} speed={h.speed} />
      ))}
    </group>
  );
}

function HeadGlow({ node, phase, speed }: { node: THREE.Vector3; phase: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = 0.3 * Math.sin(clock.getElapsedTime() * speed + phase) + 0.5;
    ref.current.scale.setScalar(0.6 + p * 0.4);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + p * 0.35;
  });
  return (
    <mesh ref={ref} position={node.toArray()}>
      <sphereGeometry args={[0.2, 18, 18]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
    </mesh>
  );
}

export function TransformerViz() {
  const [depth, setDepth] = useState(0.55); // normalized 0-1
  const [width, setWidth] = useState(0.5);
  const [heads, setHeads] = useState(0.45);
  const manifold = useMemo(() => makeManifoldPoints(), []);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="lg:w-[55%]">
          <Canvas camera={{ position: [4, 3, 4], fov: 45 }} className="h-80 w-full">
            <color attach="background" args={["#050910"]} />
            <fog attach="fog" args={["#050910", 6, 14]} />
            <Environment preset="night" />
            <ambientLight intensity={0.5} />
            <pointLight position={[2, 3, 2]} intensity={1.1} color="#c7d2fe" />
            <pointLight position={[-2, -1, -2]} intensity={0.7} color="#22d3ee" />
            <group position={[0, 0, 0]}>
              <LayerStack depth={Math.round(4 + depth * 6)} width={width} heads={Math.round(2 + heads * 6)} />
            </group>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>
        <div className="flex-1 space-y-3 text-[0.8rem] text-slate-200">
          <div className="text-[0.75rem] uppercase tracking-wide text-sky-200">Transformer knobs</div>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Depth (layers)</span>
              <span className="text-slate-200">{Math.round(6 + depth * 12)} layers</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))} className="w-full accent-sky-400" />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Width (d_model proxy)</span>
              <span className="text-slate-200">{Math.round(256 + width * 512)} dims</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} className="w-full accent-sky-400" />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Heads</span>
              <span className="text-slate-200">{Math.round(4 + heads * 8)} heads</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={heads} onChange={(e) => setHeads(parseFloat(e.target.value))} className="w-full accent-emerald-400" />
          </label>
          <p className="text-slate-400">
            This is a stylized Transformer “metric map”: more depth/heads thicken connectivity ribbons
            and brighten attention pulses. It mirrors the hyperparam card—mixed discrete/continuous
            knobs where gradients don’t help, but CMA-ES can still learn which directions matter.
          </p>
          <ManifoldHeatmap
            depth={depth}
            width={width}
            heads={heads}
            points={manifold}
          />
        </div>
      </div>
    </div>
  );
}

type ManifoldPoint = { x: number; y: number; fitness: number };

function makeManifoldPoints(): ManifoldPoint[] {
  const pts: ManifoldPoint[] = [];
  const rand = rng(2025);
  for (let i = 0; i < 220; i++) {
    const d = rand();
    const w = rand();
    const h = rand();
    const fitness = toyFit(d, w, h) + (rand() - 0.5) * 0.1;
    // fake 2D projection that preserves some ordering
    const px = d * 0.55 + w * 0.35 + (rand() - 0.5) * 0.08;
    const py = h * 0.6 + w * 0.25 + (rand() - 0.5) * 0.08;
    pts.push({ x: px, y: py, fitness });
  }
  return pts;
}

function toyFit(d: number, w: number, h: number) {
  // lower is better; prefer mid depth, moderate width, heads aligned with width
  const depthTerm = Math.pow(d - 0.55, 2) * 1.5;
  const widthTerm = Math.pow(w - 0.5, 2) * 1.2;
  const headTerm = Math.pow(h - 0.4 - 0.2 * w, 2) * 1.6;
  return depthTerm + widthTerm + headTerm;
}

function ManifoldHeatmap({ depth, width, heads, points }: { depth: number; width: number; heads: number; points: ManifoldPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const current = useMemo(() => {
    const px = depth * 0.55 + width * 0.35;
    const py = heads * 0.6 + width * 0.25;
    const fit = toyFit(depth, width, heads);
    const covScale = 0.04 + 0.12 * Math.pow(1 - fit, 1.2);
    return { px, py, cov: [covScale, 0, 0, covScale * 1.4] as [number, number, number, number] };
  }, [depth, width, heads]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const Wc = 320;
    const Hc = 220;
    ctx.clearRect(0, 0, Wc, Hc);

    // heatmap points
    points.forEach((p) => {
      const x = p.x * (Wc - 20) + 10;
      const y = Hc - (p.y * (Hc - 20) + 10);
      const hue = 200 + (1 - Math.tanh(p.fitness * 2)) * 80; // better = cooler
      ctx.fillStyle = `hsla(${hue},75%,65%,0.55)`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ellipse for current cov
    const [a, b, c, d] = current.cov;
    const tr = a + d;
    const det = a * d - b * c;
    const disc = Math.sqrt(Math.max(tr * tr - 4 * det, 0));
    const l1 = (tr + disc) / 2;
    const l2 = (tr - disc) / 2;
    const v1 = [b, l1 - a];
    const len1 = Math.hypot(v1[0], v1[1]) || 1;
    const e1 = [v1[0] / len1, v1[1] / len1];
    const angle = Math.atan2(e1[1], e1[0]);
    const cx = current.px * (Wc - 20) + 10;
    const cy = Hc - (current.py * (Hc - 20) + 10);
    const rx = Math.sqrt(Math.max(l1, 0)) * 120;
    const ry = Math.sqrt(Math.max(l2, 0)) * 120;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle);
    ctx.strokeStyle = "rgba(34,211,238,0.9)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // current point
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px Inter";
    ctx.fillText("UMAP-ish hyperparam manifold (color = fitness)", 10, 14);
  }, [points, current]);

  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-2">
      <div className="text-[0.82rem] text-slate-200 font-semibold">Hyperparam manifold (projected)</div>
      <canvas ref={canvasRef} width={320} height={220} className="w-full rounded-lg border border-slate-800/60 bg-slate-950" />
      <div className="text-[0.78rem] text-slate-400">Dots = sampled configs; cooler = better. Mint ellipse = current covariance projected.</div>
    </div>
  );
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
