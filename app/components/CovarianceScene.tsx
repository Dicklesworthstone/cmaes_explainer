"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Ellipsoid() {
  const ref = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={ref} scale={[1.4, 0.7, 1.0]}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        wireframe
        color="#7dd3fc"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function SampleCloud() {
  const makePoints = () => {
    const n = 600;
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
      data[i * 3 + 0] = x * 1.4;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }
    return data;
  };

  const points = useRef<Float32Array>(makePoints());

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points.current, 3]}
          array={points.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#22c55e"
        opacity={0.7}
        transparent
        sizeAttenuation
      />
    </points>
  );
}

export function CovarianceScene() {
  if (typeof window === "undefined") return null;

  return (
    <Canvas
      camera={{ position: [2.5, 1.4, 2.8], fov: 40 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} />
      <SampleCloud />
      <Ellipsoid />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
