/**
 * TanGorge — route repair v2: A* on a 5cm clearance grid over the furniture
 * OBB scene + line-of-sight simplification. Anchors = relocated stand-points.
 */
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const scene = createSceneFromHouseFurniture();
const R = 0.20;

function clearanceAt(x: number, y: number): number {
  return queryMultiObstacleScene(
    { position: [x, 0.5, y], robotRadius: R, safetyMargin: 0.04 },
    scene,
  ).minimumClearanceMeters;
}

// scene bounds
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (const o of scene.obstacles) {
  minX = Math.min(minX, o.center[0] - o.halfExtents[0]);
  maxX = Math.max(maxX, o.center[0] + o.halfExtents[0]);
  minY = Math.min(minY, o.center[2] - o.halfExtents[2]);
  maxY = Math.max(maxY, o.center[2] + o.halfExtents[2]);
}
minX -= 0.5; maxX += 0.5; minY -= 0.5; maxY += 0.5;
const CELL = 0.05;
const NX = Math.ceil((maxX - minX) / CELL);
const NY = Math.ceil((maxY - minY) / CELL);
console.log(`grid ${NX}x${NY} bounds x[${minX.toFixed(1)},${maxX.toFixed(1)}] y[${minY.toFixed(1)},${maxY.toFixed(1)}]`);

const FREE_MIN = 0.02;
const blocked = new Uint8Array(NX * NY);
for (let j = 0; j < NY; j++)
  for (let i = 0; i < NX; i++)
    blocked[j * NX + i] =
      clearanceAt(minX + (i + 0.5) * CELL, minY + (j + 0.5) * CELL) < FREE_MIN ? 1 : 0;
const freeCount = blocked.reduce((a, b) => a + (b ? 0 : 1), 0);
console.log(`free cells: ${freeCount}/${NX * NY}`);

const toCell = (x: number, y: number): [number, number] => [
  Math.min(NX - 1, Math.max(0, Math.floor((x - minX) / CELL))),
  Math.min(NY - 1, Math.max(0, Math.floor((y - minY) / CELL))),
];
const toWorld = (i: number, j: number): [number, number] => [
  minX + (i + 0.5) * CELL,
  minY + (j + 0.5) * CELL,
];

function astar(s: [number, number], g: [number, number]): [number, number][] | null {
  const N = NX * NY;
  const start = s[1] * NX + s[0];
  const goal = g[1] * NX + g[0];
  if (blocked[goal]) return null;
  const gScore = new Float64Array(N).fill(Infinity);
  const cameFrom = new Int32Array(N).fill(-1);
  const open: Array<[number, number]> = [[0, start]]; // [f, idx]
  gScore[start] = 0;
  const h = (idx: number) => {
    const di = Math.abs((idx % NX) - (goal % NX));
    const dj = Math.abs(Math.floor(idx / NX) - Math.floor(goal / NX));
    return Math.max(di, dj) + 0.41421356 * Math.min(di, dj);
  };
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (open[k][0] < open[bi][0]) bi = k;
    const [, cur] = open.splice(bi, 1)[0];
    if (cur === goal) {
      const path: [number, number][] = [];
      let c = cur;
      while (c !== -1) {
        path.push(toWorld(c % NX, Math.floor(c / NX)));
        c = cameFrom[c];
      }
      return path.reverse();
    }
    const ci = cur % NX;
    const cj = Math.floor(cur / NX);
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di;
        const nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
        const nIdx = nj * NX + ni;
        if (blocked[nIdx]) continue;
        if (di && dj && (blocked[cj * NX + ni] || blocked[nj * NX + ci])) continue; // no corner cutting
        const step = di && dj ? Math.SQRT2 : 1;
        const ng = gScore[cur] + step;
        if (ng < gScore[nIdx]) {
          gScore[nIdx] = ng;
          cameFrom[nIdx] = cur;
          open.push([ng + h(nIdx), nIdx]);
        }
      }
  }
  return null;
}

function segMinClear(x0: number, y0: number, x1: number, y1: number): number {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(len / 0.02));
  let min = Infinity;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    min = Math.min(min, clearanceAt(x0 + t * (x1 - x0), y0 + t * (y1 - y0)));
  }
  return min;
}

const LOS_MIN = 0.05;
function simplify(path: [number, number][]): [number, number][] {
  if (path.length < 3) return path;
  const out: [number, number][] = [path[0]];
  let anchor = 0;
  for (let i = 2; i < path.length; i++) {
    const a = path[anchor];
    const b = path[i];
    if (segMinClear(a[0], a[1], b[0], b[1]) < LOS_MIN) {
      out.push(path[i - 1]);
      anchor = i - 1;
    }
  }
  out.push(path[path.length - 1]);
  return out;
}

function findSafeNear(ox: number, oy: number): [number, number] {
  if (clearanceAt(ox, oy) >= 0.1) return [ox, oy];
  let best: [number, number] = [ox, oy];
  let bestScore = -Infinity;
  for (let rad = 0.1; rad <= 1.2; rad += 0.1) {
    for (let a = 0; a < 360; a += 10) {
      const x = ox + rad * Math.cos((a * Math.PI) / 180);
      const y = oy + rad * Math.sin((a * Math.PI) / 180);
      const c = clearanceAt(x, y);
      if (c >= 0.1) {
        const score = Math.min(c, 0.4) - rad * 0.5;
        if (score > bestScore) {
          bestScore = score;
          best = [x, y];
        }
      }
    }
    if (bestScore > -Infinity && rad >= 0.3) break;
  }
  return best;
}

console.log("\n=== repaired routes ===");
for (const route of CRAFTSMAN_WALKING_ROUTES) {
  const anchors = route.waypoints.map((wp) => findSafeNear(wp.pos[0], wp.pos[1]));
  const full: [number, number][] = [anchors[0]];
  let failed = false;
  for (let i = 0; i < anchors.length - 1; i++) {
    const seg = astar(toCell(...anchors[i]), toCell(...anchors[i + 1]));
    if (!seg) {
      console.log(`  ${route.id}: A* FAILED between "${route.waypoints[i].name}" and "${route.waypoints[i + 1].name}"`);
      failed = true;
      break;
    }
    full.push(...seg.slice(1));
  }
  if (failed) continue;
  const simple = simplify(full);
  let dist = 0;
  let minC = Infinity;
  for (let i = 0; i < simple.length - 1; i++) {
    dist += Math.hypot(simple[i + 1][0] - simple[i][0], simple[i + 1][1] - simple[i][1]);
    minC = Math.min(minC, segMinClear(simple[i][0], simple[i][1], simple[i + 1][0], simple[i + 1][1]));
  }
  console.log(`  ${route.id}: gates=${simple.length} dist=${dist.toFixed(1)}m minClear=${minC.toFixed(3)}m`);
  const outWps = simple.map((p, idx) => {
    const orig = route.waypoints[idx];
    const name =
      idx === 0
        ? route.waypoints[0].name
        : idx === simple.length - 1
          ? route.waypoints[route.waypoints.length - 1].name
          : (orig?.name ?? `via ${idx}`);
    return { name, pos: [+p[0].toFixed(3), +p[1].toFixed(3)] };
  });
  console.log(`    name-mapping: keep "${route.waypoints[0].name}" + "${route.waypoints[route.waypoints.length - 1].name}", interior anchors/vias generic`);
  for (const w of outWps) console.log(`      { name: ${JSON.stringify(w.name)}, pos: [${w.pos[0]}, ${w.pos[1]}], speed: 0.55 },`);
}
