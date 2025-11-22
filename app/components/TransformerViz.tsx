"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, Text } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// --- 3D Network Visuals ---

function DataPacket({ path }: { path: THREE.Vector3[] }) {
  const ref = useRef<THREE.Mesh>(null);
  // Stabilize random values so they don't reset on parent re-renders
  const { speed, offset } = useMemo(() => ({
    speed: Math.random() * 0.5 + 0.5,
    offset: Math.random()
  }), []);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * speed + offset) % 1;
    // Lerp along path
    const idx = t * (path.length - 1);
    const i = Math.floor(idx);
    const alpha = idx - i;
    
    if (i < path.length - 1) {
      ref.current.position.lerpVectors(path[i], path[i+1], alpha);
    }
    
    // Pulse size
    const s = 0.05 + Math.sin(t * Math.PI) * 0.05;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a78bfa" />
    </mesh>
  );
}

function LayerConnection({ start, end, activity }: { start: THREE.Vector3; end: THREE.Vector3; activity: number }) {
  // CatmullRom curve for smooth connection
  const { curvePoints, shouldSpawnPacket } = useMemo(() => {
    const mid = start.clone().lerp(end, 0.5);
    // Arc up slightly
    mid.y += start.distanceTo(end) * 0.2;
    // Add random jitter for "organic" look
    mid.x += (Math.random() - 0.5) * 0.2;
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return {
      curvePoints: curve.getPoints(20),
      // Deterministic packet spawning based on activity
      shouldSpawnPacket: activity > 0.5 && Math.random() > 0.5 
    };
  }, [start, end, activity]);

  return (
    <group>
      <line>
        <bufferGeometry setFromPoints={curvePoints} />
        <lineBasicMaterial color="#4c1d95" opacity={0.3 + activity * 0.4} transparent linewidth={1} />
      </line>
      {/* Spawn a packet if active */}
      {shouldSpawnPacket && <DataPacket path={curvePoints} />}
    </group>
  );
}

function NeuronLayer({ 
  depth, 
  layerIndex, 
  width, 
  prevLayerNodes 
}: { 
  depth: number; 
  layerIndex: number; 
  width: number; 
  prevLayerNodes?: THREE.Vector3[] 
}) {
  // Generate nodes for this layer
  const nodeCount = Math.max(3, Math.round(3 + width * 5)); // 3 to 8 nodes
  const z = (layerIndex - depth / 2) * 1.5;
  
  const nodes = useMemo(() => {
    const arr = [];
    const spread = 2.0 + width;
    for (let i = 0; i < nodeCount; i++) {
      const x = (i / (nodeCount - 1) - 0.5) * spread;
      // Slight curve to the layer
      const y = Math.cos(x * 0.8) * 0.5; 
      arr.push(new THREE.Vector3(x, y, z));
    }
    return arr;
  }, [nodeCount, width, z]);

  return (
    <group>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#2dd4bf" 
            emissive="#0f766e" 
            emissiveIntensity={1.5} 
            toneMapped={false} 
          />
        </mesh>
      ))}
      
      {/* Connections to previous layer */}
      {prevLayerNodes && prevLayerNodes.map((prevPos, i) => 
        nodes.map((currPos, j) => {
            // Sparse connections based on a hash or random seed stability
            const shouldConnect = ((i + j * 3 + layerIndex * 7) % 3) !== 0;
            if (!shouldConnect) return null;
            
            return (
              <LayerConnection 
                key={`${i}-${j}`} 
                start={prevPos} 
                end={currPos} 
                activity={Math.random()} // Random activity for visual noise
              />
            );
        })
      )}
    </group>
  );
}

function NetworkTopology({ depth, width, heads }: { depth: number; width: number; heads: number }) {
  // Recursively build layers
  // We need to generate positions layer by layer to connect them
  // But for React, we can just pre-calc all positions in a hook
  
  const layerCount = Math.max(2, Math.round(2 + depth * 4)); // 2 to 6 layers
  
  const layers = useMemo(() => {
    const ls = [];
    for (let l = 0; l < layerCount; l++) {
      const nodeCount = Math.max(3, Math.round(3 + width * 5));
      const z = (l / (layerCount - 1 || 1) - 0.5) * 3.0;
      const spread = 1.8 + width * 1.2;
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
         const x = (i / (nodeCount - 1 || 1) - 0.5) * spread;
         const y = Math.cos(x * 0.8 + l) * 0.3; 
         nodes.push(new THREE.Vector3(x, y, z));
      }
      ls.push(nodes);
    }
    return ls;
  }, [depth, width, layerCount]);

  return (
    <group>
      {layers.map((nodes, i) => (
        <group key={i}>
          {nodes.map((pos, j) => (
             <mesh key={`node-${i}-${j}`} position={pos}>
               <boxGeometry args={[0.2, 0.2, 0.05]} />
               <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
             </mesh>
          ))}
          {i > 0 && (
             <Connections from={layers[i-1]} to={nodes} density={heads} />
          )}
        </group>
      ))}
    </group>
  );
}

function Connections({ from, to, density }: { from: THREE.Vector3[]; to: THREE.Vector3[]; density: number }) {
  // Density 0..1 controls how many connections
  const els = [];
  for (let i = 0; i < from.length; i++) {
    for (let j = 0; j < to.length; j++) {
      // Deterministic pseudo-random
      const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      if ((hash - Math.floor(hash)) < (0.3 + density * 0.7)) {
         els.push(
           <LayerConnection key={`${i}-${j}`} start={from[i]} end={to[j]} activity={0.8} />
         );
      }
    }
  }
  return <group>{els}</group>;
}


// --- 2D Heatmap ---

type ManifoldPoint = { x: number; y: number; fitness: number };

function toyFit(d: number, w: number, h: number) {
  // lower is better; prefer mid depth, moderate width, heads aligned with width
  const depthTerm = Math.pow(d - 0.55, 2) * 1.5;
  const widthTerm = Math.pow(w - 0.5, 2) * 1.2;
  const headTerm = Math.pow(h - 0.4 - 0.2 * w, 2) * 1.6;
  return depthTerm + widthTerm + headTerm;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function makeManifoldPoints(): ManifoldPoint[] {
  const pts: ManifoldPoint[] = [];
  const rand = rng(2025);
  for (let i = 0; i < 300; i++) { // More points
    const d = rand();
    const w = rand();
    const h = rand();
    const fitness = toyFit(d, w, h) + (rand() - 0.5) * 0.1;
    
    // Projection
    const px = d * 0.55 + w * 0.35 + (rand() - 0.5) * 0.08;
    const py = h * 0.6 + w * 0.25 + (rand() - 0.5) * 0.08;
    pts.push({ x: px, y: py, fitness });
  }
  return pts;
}

function ManifoldHeatmap({ depth, width, heads, points }: { depth: number; width: number; heads: number; points: ManifoldPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const current = useMemo(() => {
    const px = depth * 0.55 + width * 0.35;
    const py = heads * 0.6 + width * 0.25;
    const fit = toyFit(depth, width, heads);
    // Covariance matrix proxy for ellipse
    const covScale = 0.03 + 0.08 * Math.pow(1 - Math.min(1,fit), 1.5); 
    // Skew covariance based on position
    const skew = (px - 0.5) * 0.02;
    return { px, py, cov: [covScale, skew, skew, covScale * 1.2] as [number, number, number, number] };
  }, [depth, width, heads]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 320;
    const H = 220;
    
    // Clear with fade
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<W; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,H); }
    for(let i=0; i<H; i+=20) { ctx.moveTo(0,i); ctx.lineTo(W,i); }
    ctx.stroke();

    // Heatmap points
    points.forEach((p) => {
      const x = p.x * (W - 40) + 20;
      const y = H - (p.y * (H - 40) + 20);
      
      // Color mapping
      // Good fitness (low val) -> Cyan/Blue
      // Bad fitness -> Purple/Dark
      const val = Math.tanh(p.fitness * 2); // 0..1 approx
      const hue = 280 - val * 100; // 280 (Purple) to 180 (Cyan)
      const lit = 40 + (1-val) * 30;
      
      ctx.fillStyle = `hsla(${hue}, 80%, ${lit}%, 0.8)`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow
      if (val < 0.3) {
        ctx.fillStyle = `hsla(${hue}, 80%, 80%, 0.3)`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Covariance Ellipse (CMA-ES State)
    const [a, b, c, d] = current.cov;
    const tr = a + d;
    const det = a * d - b * c;
    const disc = Math.sqrt(Math.max(tr * tr - 4 * det, 0));
    const l1 = (tr + disc) / 2;
    const l2 = (tr - disc) / 2;
    
    // Eigenvectors
    // (l1 - d) / c? 
    const theta = Math.atan2(2*b, a-d) / 2; // Standard ellipse rotation formula
    
    const cx = current.px * (W - 40) + 20;
    const cy = H - (current.py * (H - 40) + 20);
    const rx = Math.sqrt(Math.max(l1, 0.0001)) * 150;
    const ry = Math.sqrt(Math.max(l2, 0.0001)) * 150;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(theta);
    
    // Draw fill
    ctx.fillStyle = "rgba(45, 212, 191, 0.1)";
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = "rgba(45, 212, 191, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();

    // Current Point Crosshair
    ctx.strokeStyle = "#f0f9ff";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy);
    ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6);
    ctx.stroke();

  }, [points, current]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#020617] p-4 space-y-3 shadow-lg">
      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
         Loss Landscape Manifold
      </div>
      <div className="relative rounded-lg overflow-hidden border border-white/5 shadow-inner group">
         <canvas ref={canvasRef} width={320} height={220} className="w-full block bg-[#020617]" />
         <div className="absolute inset-0 pointer-events-none bg-[url('/grid-pattern.png')] opacity-10" /> {/* Fake texture if needed, or just use canvas */}
      </div>
      <div className="flex items-center justify-between text-[0.65rem] text-slate-500 font-mono">
        <span>Dimensions: 3 (Projected)</span>
        <span>Obj: Cross-Entropy</span>
      </div>
    </div>
  );
}

// --- Main Component ---

export function TransformerViz() {
  const [depth, setDepth] = useState(0.55);
  const [width, setWidth] = useState(0.5);
  const [heads, setHeads] = useState(0.45);
  const [interacting, setInteracting] = useState(false); // Mobile interaction state

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(min-width: 1024px)');
      setIsLargeScreen(mq.matches);
      const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const manifoldPoints = useMemo(() => makeManifoldPoints(), []);

  // SSR guard: Track client-side mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="glass-card p-4 md:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 3D Visualization */}
        <div className="w-full lg:w-[60%] relative group aspect-[16/10] lg:aspect-auto lg:h-[480px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#030014]">
            
            {/* Mobile Interactivity Overlay */}
            {!interacting && (
              <div 
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer lg:pointer-events-none lg:hidden"
                onClick={() => setInteracting(true)}
                onTouchStart={() => setInteracting(true)}
              >
                <div className="px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-white shadow-lg animate-pulse">
                  Tap to Interact
                </div>
              </div>
            )}

            <div
              className={`w-full h-full ${interacting ? "touch-none" : "touch-pan-y"}`}
              onPointerDown={() => setInteracting(true)}
              onPointerLeave={() => setInteracting(false)}
            >
              <Canvas 
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={40} />
                <color attach="background" args={["#030014"]} />
                <fog attach="fog" args={["#030014", 6, 18]} />
                
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#2dd4bf" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
                
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                  <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <NetworkTopology depth={depth} width={width} heads={heads} />
                  </group>
                </Float>

                <OrbitControls 
                  makeDefault
                  enabled={interacting || isLargeScreen}
                  enablePan={false} 
                  enableZoom={false} 
                  autoRotate={!interacting} 
                  autoRotateSpeed={0.8} 
                  maxPolarAngle={Math.PI / 2} 
                  minPolarAngle={Math.PI / 4}
                />
                
                {/* Floor Reflection Plane (Cheap trick: just a grid) */}
                <gridHelper position={[0, -2, 0]} args={[20, 20, "#1e1b4b", "#0f172a"]} />
              </Canvas>
            </div>
            
            <div className="absolute top-4 left-4 px-3 py-1 rounded bg-slate-950/60 backdrop-blur-md border border-white/5 text-xs text-violet-300 font-mono pointer-events-none">
              Arch: Transformer
            </div>
          </div>
        </div>

        {/* Controls & Manifold */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight mb-1 flex items-center gap-2">
               <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
               Architecture Search
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tuning discrete topological parameters (layers, width) as continuous variables. CMA-ES navigates this jagged &quot;mixed-integer&quot; landscape effectively.
            </p>
          </div>

          <div className="space-y-5 bg-slate-900/40 rounded-xl p-5 border border-white/5 backdrop-blur-sm">
            <ControlSlider 
              label="Depth (Layers)" 
              value={depth} 
              setValue={setDepth} 
              min={0} max={1} 
              displayValue={Math.round(2 + depth * 4)}
              color="violet"
            />
            <ControlSlider 
              label="Width (Dim)" 
              value={width} 
              setValue={setWidth} 
              min={0} max={1} 
              displayValue={Math.round(128 + width * 512)}
              color="teal"
            />
            <ControlSlider 
              label="Attn Heads" 
              value={heads} 
              setValue={setHeads} 
              min={0} max={1} 
              displayValue={Math.round(2 + heads * 6)}
              color="fuchsia"
            />
          </div>

          <ManifoldHeatmap
            depth={depth}
            width={width}
            heads={heads}
            points={manifoldPoints}
          />
        </div>
      </div>
    </div>
  );
}

function ControlSlider({ label, value, setValue, min, max, displayValue, color }: any) {
  const colorClass = {
    violet: "accent-violet-400 text-violet-400 border-violet-500/20 bg-violet-500/10",
    teal: "accent-teal-400 text-teal-400 border-teal-500/20 bg-teal-500/10",
    fuchsia: "accent-fuchsia-400 text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/10",
  }[color as string] || "accent-sky-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
    if (typeof navigator !== "undefined" && navigator.vibrate) {
       navigator.vibrate(5); 
    }
  };

  return (
    <div className="relative pl-2">
      <label className="block space-y-2">
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
          <span className="text-slate-400">{label}</span>
          <span className={`font-mono px-2 py-0.5 rounded border ${colorClass.split(" ").slice(1).join(" ")}`}>
            {displayValue}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={handleChange}
          className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${colorClass.split(" ")[0]}`}
        />
      </label>
    </div>
  );
}
