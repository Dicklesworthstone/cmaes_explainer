"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { safePointerEvents } from "./safeR3FEvents";
import { PerspectiveCamera, Environment, Text, useTexture, Line } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// --- Math / Color Helpers ---

// Turbo colormap approximation (Copyright 2019 Google LLC. Apache-2.0)
// Pre-allocated colors for performance
const TURBO_COLORS = [
  new THREE.Color("#30123b"), // 0.0
  new THREE.Color("#4683f6"), // 0.2
  new THREE.Color("#1bf1e8"), // 0.4
  new THREE.Color("#f1f927"), // 0.6
  new THREE.Color("#fa6e09"), // 0.8
  new THREE.Color("#7a0403")  // 1.0
];

const _tempColor = new THREE.Color();

function getTurboColor(t: number, target: THREE.Color = _tempColor): THREE.Color {
  // Clamping
  t = Math.max(0, Math.min(1, t));
  
  if (t < 0.2) target.lerpColors(TURBO_COLORS[0], TURBO_COLORS[1], t / 0.2);
  else if (t < 0.4) target.lerpColors(TURBO_COLORS[1], TURBO_COLORS[2], (t - 0.2) / 0.2);
  else if (t < 0.6) target.lerpColors(TURBO_COLORS[2], TURBO_COLORS[3], (t - 0.4) / 0.2);
  else if (t < 0.8) target.lerpColors(TURBO_COLORS[3], TURBO_COLORS[4], (t - 0.6) / 0.2);
  else target.lerpColors(TURBO_COLORS[4], TURBO_COLORS[5], (t - 0.8) / 0.2);
  
  return target;
}

// --- Components ---

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Simple wave animation via position/rotation noise
    ref.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshPhysicalMaterial 
        color="#082f49" 
        metalness={0.9} 
        roughness={0.1} 
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
  const x = span; // Half span actually

  return (
    <group>
      {/* Left Tower */}
      <group position={[-x, h / 2 - 1.5, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
        {/* Cross beams */}
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
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.6]}>
          <boxGeometry args={[0.25, h, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
         {/* Cross beams */}
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

function SegmentedDeck({ 
  span, 
  stiffness, 
  loadPos, 
  loadMass 
}: { 
  span: number; 
  stiffness: number; 
  loadPos: number; 
  loadMass: number 
}) {
  const segments = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  
  // Helper to calc displacement at x due to load at a
  const getDeflection = (x: number, a: number) => {
    const dist = Math.abs(x - a);
    const peak = (loadMass * 0.8) / (0.1 + stiffness * 2); 
    return -peak * Math.exp(-(dist * dist) / (2 * 0.2)); 
  };

  useFrame(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = -span + t * (2 * span);
      
      const y = getDeflection(x, loadPos);
      
      const stressBase = 0.1; 
      const stressLocal = Math.abs(y) * (2.0 + loadMass); 
      const stressSupport = (Math.abs(x) > span * 0.8 ? 0.3 : 0) * loadMass; 
      
      const totalStress = Math.min(1, stressBase + stressLocal + stressSupport);
      getTurboColor(totalStress, tempColor);

      dummy.position.set(x, y, 0);
      dummy.scale.set((2 * span) / segments * 0.95, 0.1, 0.8);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, segments]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
}

function MainCables({ span, sag, towerHeight }: { span: number; sag: number; towerHeight: number }) {
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const h = 2.5 + towerHeight * 1.5;
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const x = -span + (i / steps) * (2 * span);
      const y = (sag / (span * span)) * x * x + (h - sag);
      p.push(new THREE.Vector3(x, y, 0.6)); 
    }
    return p;
  }, [span, sag, towerHeight]);
  
  const points2 = useMemo(() => points.map(v => new THREE.Vector3(v.x, v.y, -0.6)), [points]);

  return (
    <group>
      <Line points={points} color="#334155" lineWidth={3} />
      <Line points={points2} color="#334155" lineWidth={3} />
    </group>
  );
}

function Suspenders({ span, sag, towerHeight }: { span: number; sag: number; towerHeight: number }) {
  const count = 16;
  const lines = useMemo(() => {
    const els = [];
    const h = 2.5 + towerHeight * 1.5;
    
    for (let i = 1; i < count; i++) {
      const x = -span + (i / count) * (2 * span);
      const topY = (sag / (span * span)) * x * x + (h - sag);
      const botY = 0; 
      els.push(
        <mesh key={`f-${i}`} position={[x, (topY + botY)/2, 0.6]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      );
      els.push(
        <mesh key={`b-${i}`} position={[x, (topY + botY)/2, -0.6]}>
          <cylinderGeometry args={[0.015, 0.015, topY - botY]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      );
    }
    return els;
  }, [span, sag, towerHeight]);
  
  return <group>{lines}</group>;
}

// --- Main Component ---

export function BridgeViz() {
  const [span, setSpan] = useState(1.3);
  const [sag, setSag] = useState(1.2);
  const [stiffness, setStiffness] = useState(0.5);
  const [load, setLoad] = useState(0.35); // Controlled by UI
  const [autoRun, setAutoRun] = useState(true);

  // Physics state for load position animation
  const physicsState = useMemo(() => ({ loadPos: 0 }), []);

  // SSR guard: Track client-side mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="glass-card p-6 space-y-6"><div className="h-[450px] w-full bg-slate-900/30 animate-pulse" /></div>;
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 3D Viewport */}
        <div className="lg:w-[65%] w-full relative group aspect-[4/3] lg:aspect-auto lg:h-[450px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a]">
            <Canvas shadows dpr={[1, 2]} events={safePointerEvents}>
              <PerspectiveCamera makeDefault position={[4, 3, 5]} fov={45} />
              <color attach="background" args={["#0f172a"]} />
              <fog attach="fog" args={["#0f172a", 8, 25]} />
              
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-bias={-0.001} />
              <Environment preset="sunset" />

              <PhysicsDriver state={physicsState} span={span} speed={autoRun ? 0.5 : 0} />
              
              <group position={[0, -0.5, 0]}>
                <Water />
                <Towers height={0.5} span={span} /> 
                <MainCables span={span} sag={sag} towerHeight={0.5} />
                <Suspenders span={span} sag={sag} towerHeight={0.5} />
                <SegmentedDeckWrapper 
                  span={span} 
                  stiffness={stiffness} 
                  loadMass={0.5 + load * 1.0} // Map load slider (0-1) to mass (0.5-1.5)
                  physicsState={physicsState} 
                />
              </group>

            </Canvas>
            
            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 flex flex-col gap-2 w-48">
              <div className="text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider mb-1">Stress Analysis (FEA)</div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#30123b] via-[#1bf1e8] to-[#7a0403]" />
              <div className="flex justify-between text-[0.6rem] text-slate-500 font-mono">
                <span>0 MPa</span>
                <span>500 MPa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-8 w-full py-2">
          <div>
             <h3 className="text-lg font-display font-bold text-white tracking-tight mb-2 flex items-center gap-2">
               <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
               Structural Optimization
             </h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               Simulating complex structural loads. The optimizer adjusts geometry (span, sag) and material properties (stiffness) to minimize weight while keeping stress within the safety envelope (colors).
             </p>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500/20 via-red-500/20 to-transparent" />

            <ControlSlider 
              label="Span Length" 
              value={span} 
              setValue={setSpan} 
              min={1.2} max={2.2} 
              displayValue={(span * 100).toFixed(0) + " m"}
              color="amber"
            />
            <ControlSlider 
              label="Cable Sag" 
              value={sag} 
              setValue={setSag} 
              min={0.5} max={2.0} 
              displayValue={(sag * 20).toFixed(0) + " m"}
              color="orange"
            />
            <ControlSlider 
              label="Deck Stiffness" 
              value={stiffness} 
              setValue={setStiffness} 
              min={0.1} max={1.0} 
              displayValue={(stiffness * 100).toFixed(0) + "%"}
              color="red"
            />
             <ControlSlider 
              label="Load Mass" 
              value={load} 
              setValue={setLoad} 
              min={0} max={1} 
              displayValue={(0.5 + load).toFixed(1) + " tons"}
              color="emerald"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
             <button 
               onClick={() => setAutoRun(!autoRun)}
               className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wide transition-all ${
                 autoRun 
                 ? "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20" 
                 : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
               }`}
             >
               {autoRun ? "Stop Load Test" : "Run Load Test"}
             </button>
             <div className="text-xs text-slate-500 italic">
               {autoRun ? "Simulating moving live load..." : "Simulation paused."}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to bridge React state and Three frame loop
function PhysicsDriver({ state, span, speed }: { state: { loadPos: number }; span: number; speed: number }) {
  useFrame((clock) => {
    if (speed > 0) {
      const t = clock.clock.elapsedTime * speed;
      // eslint-disable-next-line react-hooks/immutability
      state.loadPos = Math.sin(t) * (span - 0.2);
    }
  });
  return null;
}

// Wrapper to access physics state in the render loop
function SegmentedDeckWrapper({ 
  span, 
  stiffness, 
  loadMass, 
  physicsState 
}: { 
  span: number; 
  stiffness: number; 
  loadMass: number; 
  physicsState: { loadPos: number } 
}) {
  return (
    <>
       <SegmentedDeck span={span} stiffness={stiffness} loadPos={0} loadMass={loadMass} />
       <DeckAnimator physicsState={physicsState} span={span} stiffness={stiffness} loadMass={loadMass} />
    </>
  );
}

interface DeckAnimatorProps {
  physicsState: { loadPos: number };
  span: number;
  stiffness: number;
  loadMass: number;
}

// The actual mesh that updates every frame based on physicsState
function DeckAnimator({ physicsState, span, stiffness, loadMass }: DeckAnimatorProps) {
  const segments = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  
  const getDeflection = (x: number, a: number) => {
    const dist = Math.abs(x - a);
    const peak = (loadMass * 0.5) / (0.1 + stiffness * 1.5); 
    return -peak * Math.exp(-(dist * dist) / (0.2 + stiffness * 0.3));
  };

  useFrame(() => {
    if (!meshRef.current) return;
    
    const loadPos = physicsState.loadPos;
    const loadY = getDeflection(loadPos, loadPos);

    // Update Light position to follow load
    if (lightRef.current) {
      lightRef.current.position.set(loadPos, loadY + 0.5, 0);
    }
    // Update Cone position
    if (coneRef.current) {
       coneRef.current.position.set(loadPos, loadY + 0.5, 0);
    }
    
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = -span + t * (2 * span);
      
      const y = getDeflection(x, loadPos);
      
      const stressBase = 0.05;
      const d = Math.abs(x - loadPos);
      const stressLoad = Math.max(0, 1.0 - d*1.5) * loadMass; 
      const stressTower = (Math.exp(-Math.pow(Math.abs(x) - span, 2)/0.1)) * 0.8;
      
      const totalStress = Math.min(1, stressBase + stressLoad + stressTower);
      getTurboColor(totalStress, tempColor);

      dummy.position.set(x, y, 0);
      // eslint-disable-next-line react-hooks/immutability
      dummy.rotation.z = 0; 
      dummy.scale.set((2 * span) / segments * 1.02, 0.15, 1.2); 
      
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
      <pointLight ref={lightRef} distance={3} intensity={2} color="#fbbf24" />
      {/* Visual Load Mesh */}
      <mesh ref={coneRef} castShadow position={[0, 2, 0]}>
         <coneGeometry args={[0.2, 0.6, 16]} />
         <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={1} />
         <mesh position={[0, 0.3, 0]} rotation={[Math.PI, 0, 0]}>
           <coneGeometry args={[0.2, 0.6, 16]} />
           <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={1} />
         </mesh>
      </mesh>
    </group>
  );
}

interface ControlSliderProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  displayValue: number | string;
  color: string;
}

function ControlSlider({ label, value, setValue, min, max, displayValue, color }: ControlSliderProps) {
  const colorClass = {
    amber: "accent-amber-400 text-amber-400 border-amber-500/20 bg-amber-500/10",
    orange: "accent-orange-400 text-orange-400 border-orange-500/20 bg-orange-500/10",
    red: "accent-red-400 text-red-400 border-red-500/20 bg-red-500/10",
    emerald: "accent-emerald-400 text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  }[color as string] || "accent-slate-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
    // Haptics
    if (typeof navigator !== "undefined" && navigator.vibrate) {
       navigator.vibrate(5); // Gentle tick
    }
  };

  return (
    <div className="relative lg:pl-8 group">
      {/* Dot Decoration (Desktop only) */}
      <div className={`hidden lg:flex absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 bg-[#0f172a] z-10 items-center justify-center transition-colors duration-300 ${colorClass.replace("accent-", "border-").split(" ")[2]}`}>
        <div className={`w-2 h-2 rounded-full ${colorClass.replace("accent-", "bg-").split(" ")[0]}`} />
      </div>
      
      <label className="block space-y-3">
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
          <span className="text-slate-300 group-hover:text-white transition-colors">{label}</span>
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
          className={`w-full bg-slate-800 rounded-lg appearance-none cursor-pointer ${colorClass.split(" ")[0]}`}
        />
      </label>
    </div>
  );
}
