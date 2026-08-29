#!/usr/bin/env node
// Repair pass 3 (final): restore Segment + G1MeshState/g1MeshCache/useG1Meshes
// from the 1ed3ff0 lineage. Content-anchored extraction, idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const FILE = "app/components/G1WalkingFlagship.tsx";
let src = readFileSync(FILE, "utf8");
const head = execSync("git show 1ed3ff0:app/components/G1WalkingFlagship.tsx", {
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});

function extract(text, startAnchor, endAnchor, label) {
  const a = text.indexOf(startAnchor);
  if (a < 0) throw new Error(`HEAD extraction START not found: ${label}`);
  const b = text.indexOf(endAnchor, a);
  if (b < 0) throw new Error(`HEAD extraction END not found: ${label}`);
  return text.slice(a, b + endAnchor.length);
}

if (!src.includes("function Segment(")) {
  const seg = extract(head, "function Segment({", "\n}\n", "Segment");
  const anchor = "\nfunction RobotPose({";
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("RobotPose anchor not found");
  src = src.slice(0, a) + "\n" + seg + "\n" + src.slice(a);
  console.log("re-added Segment");
}

if (!src.includes("type G1MeshState")) {
  const meshBlock = extract(head, "type G1MeshState", "\nconst G1_POPULATION", "G1MeshState+cache+hook");
  const anchor = "\nfunction RobotStage({";
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("RobotStage anchor not found");
  src = src.slice(0, a) + "\n" + meshBlock + "\n" + src.slice(a);
  console.log("re-added G1MeshState/g1MeshCache/useG1Meshes");
}

writeFileSync(FILE, src);
console.log("REPAIR3 OK");
