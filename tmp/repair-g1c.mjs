#!/usr/bin/env node
// Repair pass 4: dedupe G1_POPULATION tail, ensure STLLoader import and
// G1_MESH_DIR const. Content-anchored, idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/G1WalkingFlagship.tsx";
let src = readFileSync(FILE, "utf8");

// 1. Drop the dangling "const G1_POPULATION" that the block extraction carried
//    along (it sits right after the useG1Meshes closing brace, before
//    "function RobotStage").
const marker = "\nconst G1_POPULATION\n";
const m = src.indexOf(marker);
if (m >= 0) {
  src = src.slice(0, m) + "\n" + src.slice(m + marker.length);
  console.log("dropped dangling G1_POPULATION fragment");
}

// 2. STLLoader import (idempotent).
const stlImport = 'import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";';
if (!src.includes(stlImport)) {
  const anchor = 'import * as THREE from "three";';
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("THREE import anchor not found");
  src = src.slice(0, a + anchor.length) + "\n" + stlImport + src.slice(a + anchor.length);
  console.log("added STLLoader import");
}

// 3. G1_MESH_DIR const (idempotent).
const dirConst = 'const G1_MESH_DIR = "/robots/g1/";';
if (!src.includes(dirConst)) {
  const anchor = "const G1_MESH_FILES";
  const a = src.indexOf(anchor);
  if (a < 0) throw new Error("G1_MESH_FILES anchor not found");
  src = src.slice(0, a) + dirConst + "\n" + src.slice(a);
  console.log("added G1_MESH_DIR");
}

writeFileSync(FILE, src);
console.log("REPAIR4 OK");
