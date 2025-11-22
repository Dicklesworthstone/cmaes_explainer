"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import type { Mesh } from "three";

function Ellipsoid() {
  const ref = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.1;
  });

  const edgeGeo = useMemo(() => new THREE.SphereGeometry(1, 24, 24), []);

  return (
    <mesh ref={ref} scale={[1.4, 0.7, 1.0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#38bdf8"
        emissive="#0ea5e9"
        emissiveIntensity={0.2}
        metalness={0.1}
        roughness={0.2}
        transparent
        opacity={0.15}
        wireframe={false}
        clearcoat={1}
      />
      <lineSegments>
        <edgesGeometry args={[edgeGeo]} />
        <lineBasicMaterial color="#7dd3fc" transparent opacity={0.3} />
      </lineSegments>
    </mesh>
  );
}

function SampleCloud() {
  const points = useMemo(() => {
    const n = 800;
    const data = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1;
      const v = Math.random() * 2 - 1;
      const w = Math.random() * 2 - 1;
      const r = Math.cbrt(Math.random());
      const len = Math.hypot(u, v, w) || 1;
      const x = (u / len) * r;
      const y = (v / len) * r * 0.55;
      const z = (w / len) * r * 0.9;
      data[i * 3 + 0] = x * 1.5;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }
    return data;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#34d399"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function CovarianceScene() {
  // SSR guard: Track client-side mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [2.8, 1.6, 3.2], fov: 35 }}
      className="h-full w-full"
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 15]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 2]} intensity={1.5} color="#e0f2fe" />
      <directionalLight position={[-2, -2, -2]} intensity={0.5} color="#0ea5e9" />
      
      <SampleCloud />
      <Ellipsoid />
      
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
