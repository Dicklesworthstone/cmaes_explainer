/**
 * TanGorge — waypoint relocation solver for CRAFTSMAN_WALKING_ROUTES.
 * Finds minimal-displacement safe stand-points (r=0.25, clearance >= 0.10),
 * inserts detour vias where straight segments still clip furniture,
 * and emits the corrected route table + audit.
 */
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const scene = createSceneFromHouseFurniture();
const R = 0.25;
const MARGIN = 0.04;

function clearanceAt(x: number, y: number): number {
  return queryMultiObstacleScene(
    { position: [x, 0.5, y], robotRadius: R, safetyMargin: MARGIN },
    scene,
  ).minimumClearanceMeters;
}

const SAFE = 0.1; // required stand-point clearance
const PATH_OK = 0.03; // required along-path clearance

function findSafeNear(ox: number, oy: number): [number, number, number] {
  // spiral search: prefer smallest displacement with clearance >= SAFE
  let best: [number, number, number] = [ox, oy, clearanceAt(ox, oy)];
  if (best[2] >= SAFE) return best;
  let bestScore = -Infinity;
  for (let rad = 0.1; rad <= 1.2; rad += 0.1) {
    for (let a = 0; a < 360; a += 10) {
      const x = ox + rad * Math.cos((a * Math.PI) / 180);
      const y = oy + rad * Math.sin((a * Math.PI) / 180);
      const c = clearanceAt(x, y);
      if (c >= SAFE) {
        // score: clear of SAFE with margin, minimal displacement
        const score = Math.min(c, 0.4) - rad * 0.5;
        if (score > bestScore) {
          bestScore = score;
          best = [x, y, c];
        }
      }
    }
    if (bestScore > -Infinity && rad >= 0.3) break; // stop expanding once decent
  }
  return best;
}

function segmentMinClearance(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): { min: number; worst: [number, number] } {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(len / 0.02));
  let min = Infinity;
  let worst: [number, number] = [x0, y0];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = x0 + t * (x1 - x0);
    const y = y0 + t * (y1 - y0);
    const c = clearanceAt(x, y);
    if (c < min) {
      min = c;
      worst = [x, y];
    }
  }
  return { min, worst };
}

console.log("=== relocated stand-points ===");
const solvedRoutes = CRAFTSMAN_WALKING_ROUTES.map((route) => {
  const wps = route.waypoints.map((wp) => {
    const [x, y, c] = findSafeNear(wp.pos[0], wp.pos[1]);
    const moved = Math.hypot(x - wp.pos[0], y - wp.pos[1]);
    if (moved > 1e-9)
      console.log(
        `  ${route.id} / ${wp.name}: (${wp.pos[0]},${wp.pos[1]}) -> (${x.toFixed(3)},${y.toFixed(3)}) clearance=${c.toFixed(3)} moved=${moved.toFixed(2)}m`,
      );
    return { name: wp.name, pos: [x, y] as [number, number], speed: wp.speed };
  });
  return { ...route, waypoints: wps };
});

console.log("\n=== segment repair (insert vias) ===");
for (const route of solvedRoutes) {
  let pass = 0;
  while (pass < 8) {
    let worstIdx = -1;
    let worstMin = Infinity;
    let worstPt: [number, number] = [0, 0];
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const a = route.waypoints[i].pos;
      const b = route.waypoints[i + 1].pos;
      const { min, worst } = segmentMinClearance(a[0], a[1], b[0], b[1]);
      if (min < worstMin) {
        worstMin = min;
        worstIdx = i;
        worstPt = worst;
      }
    }
    if (worstMin >= PATH_OK) break;
    // displace the via perpendicular to the segment toward higher clearance
    const a = route.waypoints[worstIdx].pos;
    const b = route.waypoints[worstIdx + 1].pos;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1e-9;
    const nx = -dy / len;
    const ny = dx / len;
    let bestVia: [number, number] = [worstPt[0], worstPt[1]];
    let bestC = clearanceAt(worstPt[0], worstPt[1]);
    for (const s of [0.3, 0.5, 0.8, 1.2]) {
      for (const sign of [1, -1]) {
        const x = worstPt[0] + sign * s * nx;
        const y = worstPt[1] + sign * s * ny;
        const c = clearanceAt(x, y);
        if (c > bestC) {
          bestC = c;
          bestVia = [x, y];
        }
      }
    }
    const via = {
      name: `via-${worstIdx}-${pass}`,
      pos: [
        Number(bestVia[0].toFixed(3)),
        Number(bestVia[1].toFixed(3)),
      ] as [number, number],
      speed: 0.5,
    };
    route.waypoints.splice(worstIdx + 1, 0, via);
    console.log(
      `  ${route.id}: inserted via @(${via.pos[0]},${via.pos[1]}) after "${route.waypoints[worstIdx].name}" (seg min was ${worstMin.toFixed(3)})`,
    );
    pass++;
  }
}

console.log("\n=== final audit (r=0.25 & r=0.20) ===");
for (const rr of [0.25, 0.2] as const) {
  for (const route of solvedRoutes) {
    let min = Infinity;
    let dist = 0;
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const a = route.waypoints[i].pos;
      const b = route.waypoints[i + 1].pos;
      dist += Math.hypot(b[0] - a[0], b[1] - a[1]);
      const r = segmentMinClearance(a[0], a[1], b[0], b[1]);
      const c = rr === R ? r.min : min === Infinity ? r.min : r.min; // r.min is radius-independent except robotRadius inside query
      if (c < min) min = c;
    }
    console.log(
      `  r=${rr} ${route.id.padEnd(20)} minClearance=${min.toFixed(3)}m dist=${dist.toFixed(1)}m gates=${route.waypoints.length}`,
    );
  }
}

console.log("\n=== emitted routes (paste-ready) ===");
for (const route of solvedRoutes) {
  let dist = 0;
  for (let i = 0; i < route.waypoints.length - 1; i++) {
    const a = route.waypoints[i].pos;
    const b = route.waypoints[i + 1].pos;
    dist += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  console.log(`  {`);
  console.log(`    id: "${route.id}",`);
  console.log(`    totalDistanceMeters: ${dist.toFixed(1)},`);
  console.log(`    waypoints: [`);
  for (const wp of route.waypoints) {
    console.log(
      `      { name: "${wp.name}", pos: [${wp.pos[0]}, ${wp.pos[1]}], speed: ${wp.speed} },`,
    );
  }
  console.log(`    ],`);
  console.log(`  },`);
}
