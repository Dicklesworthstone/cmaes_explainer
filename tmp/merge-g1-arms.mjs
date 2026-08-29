#!/usr/bin/env node
// Content-anchored merge for G1WalkingFlagship.tsx under concurrent sibling
// edits: every op verifies its anchor, fails loudly, and rewrites atomically.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/G1WalkingFlagship.tsx";
let src = readFileSync(FILE, "utf8");

function replaceBlock(src, startAnchor, endAnchor, replacement, label) {
  const a = src.indexOf(startAnchor);
  if (a < 0) throw new Error(`anchor START not found: ${label}`);
  const b = src.indexOf(endAnchor, a);
  if (b < 0) throw new Error(`anchor END not found: ${label}`);
  return src.slice(0, a) + replacement + src.slice(b + endAnchor.length);
}

// 1. Canonical LINK_NAMES (30 whole-body links) — repairs pollution from the
//    interrupted edit (STL entries accidentally landed inside the array).
const LINK_NAMES = `const LINK_NAMES = [
  "pelvis",
  "left hip pitch",
  "left hip roll",
  "left hip yaw",
  "left knee",
  "left ankle pitch",
  "left ankle roll",
  "right hip pitch",
  "right hip roll",
  "right hip yaw",
  "right knee",
  "right ankle pitch",
  "right ankle roll",
  "waist yaw",
  "waist roll",
  "torso",
  "left shoulder pitch",
  "left shoulder roll",
  "left shoulder yaw",
  "left elbow",
  "left wrist roll",
  "left wrist pitch",
  "left wrist yaw",
  "right shoulder pitch",
  "right shoulder roll",
  "right shoulder yaw",
  "right elbow",
  "right wrist roll",
  "right wrist pitch",
  "right wrist yaw",
] as const;`;
src = replaceBlock(src, "const LINK_NAMES = [", "] as const;", LINK_NAMES, "LINK_NAMES");

// 2. Canonical G1_MESH_FILES: 30 body/arm links + head.
const MANIFEST = `const G1_MESH_FILES: Record<string, string> = {
  pelvis: "pelvis.STL",
  "left hip pitch": "left_hip_pitch_link.STL",
  "left hip roll": "left_hip_roll_link.STL",
  "left hip yaw": "left_hip_yaw_link.STL",
  "left knee": "left_knee_link.STL",
  "left ankle pitch": "left_ankle_pitch_link.STL",
  "left ankle roll": "left_ankle_roll_link.STL",
  "right hip pitch": "right_hip_pitch_link.STL",
  "right hip roll": "right_hip_roll_link.STL",
  "right hip yaw": "right_hip_yaw_link.STL",
  "right knee": "right_knee_link.STL",
  "right ankle pitch": "right_ankle_pitch_link.STL",
  "right ankle roll": "right_ankle_roll_link.STL",
  "waist yaw": "waist_yaw_link.STL",
  "waist roll": "waist_roll_link.STL",
  torso: "torso_link.STL",
  head: "head_link.STL",
  "left shoulder pitch": "left_shoulder_pitch_link.STL",
  "left shoulder roll": "left_shoulder_roll_link.STL",
  "left shoulder yaw": "left_shoulder_yaw_link.STL",
  "left elbow": "left_elbow_link.STL",
  "left wrist roll": "left_wrist_roll_link.STL",
  "left wrist pitch": "left_wrist_pitch_link.STL",
  "left wrist yaw": "left_wrist_yaw_link.STL",
  "left hand": "left_rubber_hand.STL",
  "right shoulder pitch": "right_shoulder_pitch_link.STL",
  "right shoulder roll": "right_shoulder_roll_link.STL",
  "right shoulder yaw": "right_shoulder_yaw_link.STL",
  "right elbow": "right_elbow_link.STL",
  "right wrist roll": "right_wrist_roll_link.STL",
  "right wrist pitch": "right_wrist_pitch_link.STL",
  "right wrist yaw": "right_wrist_yaw_link.STL",
  "right hand": "right_rubber_hand.STL",
};`;
if (src.includes("const G1_MESH_FILES")) {
  src = replaceBlock(src, "const G1_MESH_FILES", "};", MANIFEST, "G1_MESH_FILES");
} else {
  // Insert after LINK_PARENTS block (before G1_HORIZON_STEPS).
  const anchor = "const G1_HORIZON_STEPS = Math.round(";
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("anchor not found: G1_HORIZON_STEPS");
  src = src.slice(0, a) + MANIFEST + "\n" + src.slice(a);
}

// 3. Remove the static neutral-pose arm machinery: the whole-body trace now
//    carries arm link poses, so static chains would double-render the arms.
const chainStart = src.indexOf("const G1_ARM_CHAINS");
if (chainStart >= 0) {
  const chainEnd = src.indexOf("];", chainStart);
  const lastEnd = src.indexOf("];", src.indexOf("],", src.indexOf("],", chainStart) + 1) + 2);
  // find the true end: the chain literal ends with "  },\n];" — search from chainStart for "\n];"
  const end = src.indexOf("\n];", chainStart);
  if (end < 0) throw new Error("anchor END not found: G1_ARM_CHAINS");
  src = src.slice(0, chainStart) + src.slice(end + 3);
}
const armGroupStart = src.indexOf("function ArmGroup(");
if (armGroupStart >= 0) {
  const end = src.indexOf("\n}\n\n", armGroupStart);
  src = src.slice(0, armGroupStart) + src.slice(end + 4);
}
const armLabelStart = src.indexOf("function armLabel(");
if (armLabelStart >= 0) {
  const end = src.indexOf("\n}\n\n", armLabelStart);
  src = src.slice(0, armLabelStart) + src.slice(end + 4);
}
// Remove the static-chain wiring in RobotPoseMeshes' torso branch.
const wireStart = src.indexOf('{name === "torso"\n              ? G1_ARM_CHAINS.map(');
if (wireStart >= 0) {
  const wireEnd = src.indexOf(": null}", wireStart);
  src = src.slice(0, wireStart) + src.slice(wireEnd + ": null}".length);
}

// 4. Hands ride the wrist-yaw links as fixed children (URDF palm joint
//    origins: left [0.0415, 0.003, 0]; right [0.0415, -0.003, 0]).
const wristAnchor = 'name === "left wrist yaw"';
if (src.includes(wristAnchor)) throw new Error("hand wiring already present");
const leftWrist = `            name === "left wrist yaw" ? (
              <group position={ownerToThree([0.0415, 0.003, 0])}>
                <mesh geometry={meshes.geometries["left hand"]} material={meshes.material} castShadow />
              </group>
            ) : null;
            name === "right wrist yaw" ? (
              <group position={ownerToThree([0.0415, -0.003, 0])}>
                <mesh geometry={meshes.geometries["right hand"]} material={meshes.material} castShadow />
              </group>
            ) : null;`;
const torsoWiring = src.indexOf('{name === "torso" ?');
if (torsoWiring < 0) throw new Error("anchor not found: torso branch");
// Append hand wiring inside the same conditional chain: rewrite the torso
// conditional to a compound expression.
const torsoBlockStart = src.indexOf('{name === "torso" ?');
const torsoBlockEnd = src.indexOf(") : null}", torsoBlockStart) + ") : null}".length;
const torsoBlock = src.slice(torsoBlockStart, torsoBlockEnd);
const handExpr = leftWrist.replace("            name === \"left wrist yaw\" ? (", "            name === \"left wrist yaw\" ? (").replace(") : null;\n            name === \"right wrist yaw\" ? (", ") : name === \"right wrist yaw\" ? (");
const newTorso = torsoBlock.replace(
  ") : null}",
  `) : name === "left wrist yaw" ? (
              <group position={ownerToThree([0.0415, 0.003, 0])}>
                <mesh geometry={meshes.geometries["left hand"]} material={meshes.material} castShadow />
              </group>
            ) : name === "right wrist yaw" ? (
              <group position={ownerToThree([0.0415, -0.003, 0])}>
                <mesh geometry={meshes.geometries["right hand"]} material={meshes.material} castShadow />
              </group>
            ) : null}`
);
src = src.slice(0, torsoBlockStart) + newTorso + src.slice(torsoBlockEnd);

writeFileSync(FILE, src);
console.log("MERGED OK — LINK_NAMES 30, manifest 31 entries, arms ride the trace");
