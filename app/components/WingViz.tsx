"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// --- Math / Physics Helpers ---

/**
 * Generates a NACA 4-digit airfoil shape.
 * @param m Max camber (0 to 0.095)
 * @param p Max camber position (0 to 0.9)
 * @param t Max thickness (0 to 0.3)
 * @param chord Chord length
 */
function getNacaCoords(m: number, p: number, t: number, chord: number = 1, points: number = 100) {
  const shape = new THREE.Shape();
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * chord;
    // Mean camber line yc and gradient dyc/dx
    let yc = 0;
    let dyc_dx = 0;

    if (p > 0) {
      if (x <= p * chord) {
        yc = (m / (p * p)) * (2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / (p * p)) * (p - x / chord);
      } else {
        yc = (m / ((1 - p) ** 2)) * ((1 - 2 * p) + 2 * p * (x / chord) - (x / chord) ** 2);
        dyc_dx = ((2 * m) / ((1 - p) ** 2)) * (p - x / chord);
      }
    }

    // Thickness distribution yt
    const yt = 5 * t * (0.2969 * Math.sqrt(x / chord) - 0.1260 * (x / chord) - 0.3516 * (x / chord) ** 2 + 0.2843 * (x / chord) ** 3 - 0.1015 * (x / chord) ** 4);
    const theta = Math.atan(dyc_dx);

    upper.push([x - yt * Math.sin(theta), yc + yt * Math.cos(theta)]);
    lower.push([x + yt * Math.sin(theta), yc - yt * Math.cos(theta)]);
  }

  // Build shape
  shape.moveTo(upper[0][0] - chord / 2, upper[0][1]);
  for (const pt of upper) shape.lineTo(pt[0] - chord / 2, pt[1]);
  for (let i = lower.length - 1; i >= 0; i--) shape.lineTo(lower[i][0] - chord / 2, lower[i][1]);
  shape.closePath();

  return shape;
}

// --- Components ---

function Airfoil({ aspect, sweep, thickness }: { aspect: number; sweep: number; thickness: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Map 0-1 inputs to NACA params
  const maxCamber = 0.0 + sweep * 0.06; // 0% to 6% camber
  const camberPos = 0.4;
  const thick = 0.06 + thickness * 0.18; // 6% to 24% thickness
  const span = 1.5 + aspect * 2.5; // Physical width

  const geometry = useMemo(() => {
    const shape = getNacaCoords(maxCamber, camberPos, thick, 1.5);
    const extrudeSettings = {
      depth: span,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 5,
      steps: 1, // Keeps it simple, but we could segment for twist
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry
    geom.center();
    // Apply slight taper or twist if we wanted, but let's stick to simple extrusion for stability
    return geom;
  }, [maxCamber, camberPos, thick, span]);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Subtle floating animation
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    // Banking based on "lift" (fake)
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#e2e8f0"
          metalness={0.6}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

function Streamlines({ speed = 1, liftStrength = 0.5 }) {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []); // Reusable color object
  
  // Initial positions
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 6,
      speed: Math.random() * 0.5 + 0.5,
      life: Math.random(),
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // const t = state.clock.elapsedTime; // Unused

    particles.forEach((p, i) => {
      // Move forward
      p.x += p.speed * speed * 8 * delta;

      // Reset if out of bounds
      if (p.x > 5) {
        p.x = -5;
        p.y = (Math.random() - 0.5) * 4;
        p.z = (Math.random() - 0.5) * 6;
      }

      // Simple flow deflection logic (fake CFD)
      // If near center (0,0,0), deflect Y based on Z position relative to wing
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      if (dist < 2) {
        // Push up or down based on "lift"
        // Particles above get pushed down (Bernoulli/Coanda simplified), below pushed up? 
        // Actually for lift: air is pushed DOWN, wing goes UP.
        // So particles passing near wing should deflect downwards.
        const deflection = (1.0 - dist / 2) * liftStrength * 0.1;
        p.y -= deflection;
      }

      dummy.position.set(p.x, p.y, p.z);
      
      // Stretch based on speed
      dummy.scale.set(0.8 + p.speed * 0.5, 0.03, 0.03);
      dummy.rotation.z = 0; // Reset
      
      // Orient to flow (simple approximation)
      // If we had real velocity vectors we'd use lookAt
      dummy.rotation.z = dist < 2 ? -liftStrength * 0.5 * (1 - dist/2) : 0;

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Update color based on speed/pressure
      // High pressure (slow) = red? Low pressure (fast) = blue?
      // Let's just use a cool "airflow" gradient
      const hue = 0.5 + (p.y * 0.1); // Cyan/Blue range
      tempColor.setHSL(hue, 0.9, 0.6);
      meshRef.current!.setColorAt(i, tempColor);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

function LiftVector({ liftVal }: { liftVal: number }) {
  // Visual arrow indicating lift force
  return (
    <group position={[0, 1.5, 0]}>
      <Text
        position={[0, liftVal * 2 + 0.5, 0]}
        fontSize={0.3}
        color="#38bdf8"
        anchorX="center"
        anchorY="bottom"
      >
        {(liftVal * 1000).toFixed(0)} N
      </Text>
      <mesh position={[0, liftVal, 0]} scale={[0.1, liftVal * 2, 0.1]}>
        <cylinderGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, liftVal * 2, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// --- Main Component ---

export function WingViz() {
  const [aspect, setAspect] = useState(0.55);
  const [sweep, setSweep] = useState(0.4);
  const [thickness, setThickness] = useState(0.5);
  const [interacting, setInteracting] = useState(false); // Track interaction for overlay

  // Toy physics model for "fitness" (Lift/Drag ratio)
  // Higher aspect = better L/D usually
  // Higher thickness = more drag, but maybe more structural integrity (not modeled here)
  // Higher sweep = better high speed, worse low speed
  const lift = useMemo(() => {
    return (0.5 + aspect * 0.8) * (1.2 - thickness * 0.4) * (1.0 - Math.abs(sweep - 0.3) * 0.5);
  }, [aspect, sweep, thickness]);

  const drag = useMemo(() => {
    return (0.1 + thickness * 0.6) + (1.0 - aspect) * 0.2;
  }, [aspect, thickness]);

  const ratio = lift / drag;

  return (
    <div className="glass-card p-4 md:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Visualization Canvas */}
        <div className="w-full lg:w-[65%] relative group aspect-[16/10] lg:aspect-auto lg:h-[450px]">
          <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
          <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#020617]">
            
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

            <Canvas 
              shadows 
              dpr={[1, 2]} 
              className={`${interacting ? "touch-none" : "touch-pan-y"}`}
              onPointerDown={() => setInteracting(true)}
              onPointerLeave={() => setInteracting(false)}
            >
              <PerspectiveCamera makeDefault position={[4, 2, 4]} fov={40} />
              <color attach="background" args={["#020617"]} />
              <fog attach="fog" args={["#020617", 5, 20]} />
              
              {/* Lighting */}
              <ambientLight intensity={0.2} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />
              
              <Environment preset="city" />

              {/* Scene */}
              <group position={[0, -0.5, 0]}>
                <Airfoil aspect={aspect} sweep={sweep} thickness={thickness} />
                <Streamlines speed={1.5} liftStrength={lift} />
                <LiftVector liftVal={lift * 0.5} />
                
                {/* Grid Floor */}
                <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -2, 0]} />
              </group>

              <OrbitControls 
                enabled={interacting || (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)}
                enablePan={false} 
                enableZoom={false} 
                minPolarAngle={Math.PI / 4} 
                maxPolarAngle={Math.PI / 2}
                autoRotate={!interacting}
                autoRotateSpeed={0.5}
              />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
              <div className="px-2 py-1 rounded bg-slate-950/80 text-[0.65rem] text-cyan-400 border border-cyan-900/50 backdrop-blur-md shadow-lg">
                 <span className="font-bold">L/D Ratio:</span> {ratio.toFixed(2)}
              </div>
              <div className="px-2 py-1 rounded bg-slate-950/80 text-[0.65rem] text-rose-400 border border-rose-900/50 backdrop-blur-md shadow-lg">
                 <span className="font-bold">Drag Coeff:</span> {drag.toFixed(3)}
              </div>
            </div>

            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-950/50 text-[0.7rem] font-mono text-slate-400 backdrop-blur-sm border border-white/10 flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
              CFD Proxy Running
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-8 w-full py-2">
          <div>
             <h3 className="text-lg font-display font-bold text-white tracking-tight mb-2 flex items-center gap-2">
               <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
               Airfoil Optimization
             </h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               CMA-ES explores this geometric search space to maximize lift-to-drag ratio. 
               The visualization shows the generated NACA airfoil profile and a simplified flow field response.
             </p>
          </div>

          <div className="space-y-8 relative">
            {/* Connecting line decoration */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/20 via-blue-500/20 to-transparent hidden lg:block" />

            <ControlSlider 
              label="Aspect Ratio" 
              value={aspect} 
              setValue={setAspect} 
              min={0} max={1} 
              displayValue={(6 + aspect * 6).toFixed(1)}
              color="cyan"
            />
            <ControlSlider 
              label="Camber / Sweep" 
              value={sweep} 
              setValue={setSweep} 
              min={0} max={1} 
              displayValue={(sweep * 8).toFixed(1) + "%"}
              color="blue"
            />
            <ControlSlider 
              label="Thickness" 
              value={thickness} 
              setValue={setThickness} 
              min={0} max={1} 
              displayValue={(6 + thickness * 18).toFixed(1) + "%"}
              color="indigo"
            />
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5 text-xs text-slate-500">
            <strong className="text-slate-300">Why it matters:</strong> Small changes in curvature (Camber) drastically alter the pressure distribution. A gradient-free optimizer like CMA-ES is robust against the "noise" often found in real fluid dynamics simulations.
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({ label, value, setValue, min, max, displayValue, color }: any) {
  const colorClass = {
    cyan: "accent-cyan-400 text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    blue: "accent-blue-400 text-blue-400 border-blue-500/20 bg-blue-500/10",
    indigo: "accent-indigo-400 text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  }[color as string] || "accent-sky-500";

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
      <div className={`hidden lg:flex absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 bg-[#020617] z-10 items-center justify-center transition-colors duration-300 ${colorClass.replace("accent-", "border-").split(" ")[2]}`}>
        <div className={`w-2 h-2 rounded-full ${colorClass.replace("accent-", "bg-").split(" ")[1]}`} />
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
