#!/usr/bin/env node
// Repair pass 2: restore LINK_PARENTS (30-entry) and G1_HEAD_JOINT_ORIGIN
// consumed by the block replacements. Content-anchored, idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/G1WalkingFlagship.tsx";
let src = readFileSync(FILE, "utf8");

const LINK_PARENTS = `const LINK_PARENTS = [
  -1, 0, 1, 2, 3, 4, 5, 0, 7, 8, 9, 10, 11, 0, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 15, 23, 24, 25, 26, 27, 28,
] as const;`;

if (!src.includes("const LINK_PARENTS")) {
  const anchor = "] as const;";
  const namesEnd = src.indexOf(anchor, src.indexOf("const LINK_NAMES = ["));
  if (namesEnd < 0) throw new Error("LINK_NAMES close not found");
  const insertAt = namesEnd + anchor.length;
  src = src.slice(0, insertAt) + "\n" + LINK_PARENTS + src.slice(insertAt);
  console.log("re-added LINK_PARENTS");
}

if (!src.includes("const G1_HEAD_JOINT_ORIGIN")) {
  const headOrigin = `// Head is a fixed child of torso_link: URDF head_joint origin (0.004, 0, -0.054).
const G1_HEAD_JOINT_ORIGIN: [number, number, number] = [0.004, 0, -0.054];`;
  const anchor = "const G1_POPULATION = 16;";
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("G1_POPULATION anchor not found");
  src = src.slice(0, a) + headOrigin + "\n" + src.slice(a);
  console.log("re-added G1_HEAD_JOINT_ORIGIN");
}

writeFileSync(FILE, src);
console.log("REPAIR OK");
