"use client";

import React, { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Gauge, CheckCircle2, ShieldAlert, Sparkles, Activity } from "lucide-react";
import type { HouseholdManipulationTraceSample } from "../lib/frankensimCmaes";
import { computeFerrariCannyGWS } from "../lib/armInverseKinematics";

interface ArmGraspMicroscopeProps {
  sample: HouseholdManipulationTraceSample | null;
  enabled?: boolean;
}

/**
 * 3D friction-cone overlay and tactile HUD for the household iiwa 7 exhibit:
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
  const [manualMode, setManualMode] = useState(false);
  const [manualForce, setManualForce] = useState(12.5);

  const rawGrasped = sample?.grasped ?? false;
  const gripperWidth = sample?.gripperWidthMeters ?? 0.085;
  const rawGripForce = sample?.gripNormalForceNewtons ?? 0;

  const gripForce = manualMode ? manualForce : rawGripForce;
  const isGrasped = manualMode ? manualForce >= 2.0 : rawGrasped;

  const gws = useMemo(() => {
    return computeFerrariCannyGWS(gripForce, gripperWidth, 0.04, 0.65);
  }, [gripForce, gripperWidth]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Tactile Grasp Microscope & Ferrari-Canny GWS HUD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setManualMode(!manualMode)}
            className={`rounded-lg px-2 py-0.5 text-[0.65rem] font-semibold transition-all ${
              manualMode
                ? "border border-amber-400/50 bg-amber-500/20 text-amber-200"
                : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            {manualMode ? "🖐️ Manual Probe Active" : "📡 Auto Telemetry"}
          </button>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider ${
              isGrasped
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
            }`}
          >
            {isGrasped ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
            {isGrasped ? "Grasp Verified (assumed μ=0.65)" : "Free-Space Approach"}
          </span>
        </div>
      </div>

      {manualMode && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 flex items-center gap-3">
          <span className="text-xs text-amber-200 font-medium whitespace-nowrap">
            Manual Pinch Probe: <strong className="font-mono text-amber-300">{manualForce.toFixed(1)} N</strong>
          </span>
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={manualForce}
            onChange={(e) => setManualForce(Number(e.target.value))}
            className="w-full accent-amber-400 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
          />
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Grip Phase
          </span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            {isGrasped ? "Locked" : "Pre-Contact"}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Ferrari-Canny GWS (ε)
          </span>
          <span className="font-mono text-sm font-bold text-amber-300 mt-0.5 block">
            {`${(gws.gwsRadius * 100).toFixed(1)}%`}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Normal Pinch Force
          </span>
          <span className="font-mono text-sm font-bold text-emerald-300 mt-0.5 block">
            {`${gripForce.toFixed(1)} N`}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
          <span className="text-[0.65rem] text-slate-300 uppercase tracking-wider block">
            Friction Cone Capacity
          </span>
          <span className="font-mono text-sm font-bold text-violet-300 mt-0.5 block">
            {`${gws.maxFrictionForceN.toFixed(1)} N static`}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface ArmJointKinematicsStripProps {
  jointAngles: number[];
  dragActive?: boolean;
}

const JOINT_SPECS = [
  { name: "A1 Base", limit: 2.96 },
  { name: "A2 Shoulder", limit: 2.09 },
  { name: "A3 Arm", limit: 2.96 },
  { name: "A4 Elbow", limit: 2.09 },
  { name: "A5 Wrist 1", limit: 2.96 },
  { name: "A6 Wrist 2", limit: 2.09 },
  { name: "A7 Flange", limit: 3.05 },
];

export function ArmJointKinematicsStrip({ jointAngles, dragActive }: ArmJointKinematicsStripProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-400" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            7-DoF iiwa Joint Kinematics & Mechanical Limit Telemetry
          </span>
        </div>
        <div className="flex items-center gap-2">
          {dragActive && (
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2 py-0.5 text-[0.62rem] font-bold uppercase text-cyan-200">
              Reach probe · auxiliary 4-joint chain
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-[0.65rem] text-slate-400 hover:text-slate-200"
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {JOINT_SPECS.map((spec, idx) => {
            const angle = jointAngles[idx] ?? 0;
            const deg = (angle * 180) / Math.PI;
            const limitDeg = (spec.limit * 180) / Math.PI;
            const absRatio = Math.min(1, Math.abs(angle) / spec.limit);
            const isNearLimit = Math.abs(angle) >= spec.limit - 0.22;

            return (
              <div
                key={spec.name}
                className={`rounded-xl border p-2 text-center transition-colors ${
                  isNearLimit
                    ? "border-amber-400/40 bg-amber-500/10"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between text-[0.62rem] text-slate-400">
                  <span className="font-semibold">{spec.name}</span>
                  <span className="font-mono">±{limitDeg.toFixed(0)}°</span>
                </div>
                <div className={`mt-1 font-mono text-sm font-bold ${
                  isNearLimit ? "text-amber-300" : "text-white"
                }`}>
                  {deg >= 0 ? `+${deg.toFixed(1)}°` : `${deg.toFixed(1)}°`}
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      isNearLimit
                        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${absRatio * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

