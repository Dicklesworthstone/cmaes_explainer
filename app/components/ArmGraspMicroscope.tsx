"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { Gauge, CheckCircle2, ShieldAlert, Sparkles, Activity } from "lucide-react";
import type { HouseholdManipulationTraceSample } from "../lib/frankensimCmaes";
import { computeFerrariCannyGWS } from "../lib/armInverseKinematics";

interface ArmGraspMicroscopeProps {
  sample: HouseholdManipulationTraceSample | null;
  enabled?: boolean;
}

/**
 * 3D Friction Cone overlay and Tactile HUD for KUKA iiwa14 Manipulation:
 * Visualizes the Coulomb static friction boundary (tan theta = mu = 0.65),
 * normal grip pinch force, and contact status.
 */
export function ArmGraspMicroscopeOverlay({
  sample,
  enabled = true,
}: {
  sample: HouseholdManipulationTraceSample | null;
  enabled: boolean;
}) {
  const coneGeometry = useMemo(() => {
    // Cone representing Coulomb friction cone: height 0.08m, radius 0.08 * 0.65 = 0.052m
    const geom = new THREE.ConeGeometry(0.052, 0.08, 16);
    geom.translate(0, -0.04, 0); // apex at contact point
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      coneGeometry.dispose();
    };
  }, [coneGeometry]);

  if (!enabled || !sample) return null;

  const objectPos = sample.objectPose.position;
  const isGrasped = sample.grasped;

  return (
    <group position={[objectPos[0], objectPos[2], -objectPos[1]]}>
      {/* Target Object Highlight Halo */}
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial
          color={isGrasped ? "#10b981" : "#f59e0b"}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Left Finger Friction Cone */}
      <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <primitive object={coneGeometry} attach="geometry" />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={isGrasped ? 0.7 : 0.25}
        />
      </mesh>

      {/* Right Finger Friction Cone */}
      <mesh position={[0.04, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <primitive object={coneGeometry} attach="geometry" />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={isGrasped ? 0.7 : 0.25}
        />
      </mesh>
    </group>
  );
}

export function ArmGraspMicroscopeHUD({ sample }: ArmGraspMicroscopeProps) {
  const isGrasped = sample?.grasped ?? false;
  const gripperWidth = sample?.gripperWidthMeters ?? 0.105;
  const gripForce = sample?.gripNormalForceNewtons ?? 0;

  const gws = useMemo(() => {
    return computeFerrariCannyGWS(gripForce, gripperWidth, 0.04, 0.65);
  }, [gripForce, gripperWidth]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Tactile Grasp Microscope & Ferrari-Canny GWS HUD
          </span>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider ${
            isGrasped
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
          }`}
        >
          {isGrasped ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
          {isGrasped ? "Grasp Verified (μ=0.65)" : "Free-Space Approach"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Grip Phase
          </span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            {sample ? (isGrasped ? "Locked" : "Pre-Contact") : "—"}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Ferrari-Canny GWS (ε)
          </span>
          <span className="font-mono text-sm font-bold text-amber-300 mt-0.5 block">
            {sample ? `${(gws.gwsRadius * 100).toFixed(1)}%` : "—"}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Normal Pinch Force
          </span>
          <span className="font-mono text-sm font-bold text-emerald-300 mt-0.5 block">
            {sample ? `${gripForce.toFixed(1)} N` : "—"}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Friction Cone Capacity
          </span>
          <span className="font-mono text-sm font-bold text-violet-300 mt-0.5 block">
            {sample ? `${gws.maxFrictionForceN.toFixed(1)} N static` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
