/**
 * TanGorge — route repair v6 (final).
 * Contract: every sampled point on every route keeps clearance > 0.005 m at
 * robotRadius 0.20 against the shipped furniture scene (rugs/curtains/pillows
 * soft-excluded by createSceneFromHouseFurniture) and never crosses a wall
 * except through authored doorway apertures. Gates carry POI names at the
 * nearest ordered path vertices; relocation distance reported per POI.
 */
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const scene = createSceneFromHouseFurniture();
const R = 0.2;
const FREE_MIN = 0.005;

function clearanceAt(x: number, y: number): number {
  return queryMultiObstacleScene(
    { position: [x, 0.5, y], robotRadius: R, safetyMargin: 0.04 },
    scene,
  ).minimumClearanceMeters;
}

const WALL_HALF = 0.06;
function inWall(x: number, y: number): boolean {
  for (const w of CRAFTSMAN_BUNGALOW_1928.walls) {
    const dx = w.to[0] - w.from[0];
    const dy = w.to[1] - w.from[1];
    const len = Math.hypot(dx, dy);
    const s = ((x - w.from[0]) * dx + (y - w.from[1]) * dy) / (len * len);
    if (s < 0 || s > 1) continue;
    const px = w.from[0] + s * dx;
    const py = w.from[1] + s * dy;
    if (Math.hypot(x - px, y - py) > Math.max(WALL_HALF, w.thickness / 2)) continue;
    let inDoor = false;
    for (const d of w.doorways)
      if (s * len >= d.at - d.width / 2 && s * len <= d.at + d.width / 2) { inDoor = true; break; }
    if (!inDoor) return true;
  }
  return false;
}

const b = CRAFTSMAN_BUNGALOW_1928.bounds;
const minX = b.min[0] - 0.08, maxX = b.max[0] + 0.08;
const minY = b.min[1] - 0.08, maxY = b.max[1] + 0.08;
const CELL = 0.05;
const NX = Math.ceil((maxX - minX) / CELL);
const NY = Math.ceil((maxY - minY) / CELL);
const free = new Uint8Array(NX * NY);
for (let j = 0; j < NY; j++)
  for (let i = 0; i < NX; i++) {
    const x = minX + (i + 0.5) * CELL;
    const y = minY + (j + 0.5) * CELL;
    free[j * NX + i] = !inWall(x, y) && clearanceAt(x, y) >= FREE_MIN ? 1 : 0;
  }

const comp = new Int32Array(NX * NY).fill(-1);
const sizes: number[] = [];
for (let s = 0; s < NX * NY; s++) {
  if (!free[s] || comp[s] !== -1) continue;
  const id = sizes.length;
  let size = 0;
  const stack = [s];
  comp[s] = id;
  while (stack.length) {
    const c = stack.pop()!;
    size++;
    const ci = c % NX, cj = (c / NX) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
      const n = nj * NX + ni;
      if (free[n] && comp[n] === -1) { comp[n] = id; stack.push(n); }
    }
  }
  sizes.push(size);
}
const MAIN = sizes.indexOf(Math.max(...sizes));
console.log(`grid ${NX}x${NY}; comps: ${sizes.length} (main size ${sizes[MAIN]})`);

const toCellIdx = (x: number, y: number): [number, number] => [
  Math.min(NX - 1, Math.max(0, Math.floor((x - minX) / CELL))),
  Math.min(NY - 1, Math.max(0, Math.floor((y - minY) / CELL))),
];

function astar(s: [number, number], g: [number, number]): [number, number][] | null {
  const N = NX * NY;
  const start = s[1] * NX + s[0];
  const goal = g[1] * NX + g[0];
  if (!free[goal] || !free[start] || comp[start] !== comp[goal]) return null;
  const gScore = new Float64Array(N).fill(Infinity);
  const cameFrom = new Int32Array(N).fill(-1);
  const open: Array<[number, number]> = [[0, start]];
  gScore[start] = 0;
  const gi = goal % NX, gj = (goal / NX) | 0;
  const h = (idx: number) => {
    const di = Math.abs((idx % NX) - gi), dj = Math.abs(((idx / NX) | 0) - gj);
    return Math.max(di, dj) + 0.41421356 * Math.min(di, dj);
  };
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (open[k][0] < open[bi][0]) bi = k;
    const [, cur] = open.splice(bi, 1)[0];
    if (cur === goal) {
      const path: [number, number][] = [];
      let c = cur;
      while (c !== -1) { path.push([minX + ((c % NX) + 0.5) * CELL, minY + (((c / NX) | 0) + 0.5) * CELL]); c = cameFrom[c]; }
      return path.reverse();
    }
    const ci = cur % NX, cj = (cur / NX) | 0;
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di, nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
        const nIdx = nj * NX + ni;
        if (!free[nIdx]) continue;
        if (di && dj && (!free[cj * NX + ni] || !free[nj * NX + ci])) continue;
        const ng = gScore[cur] + (di && dj ? Math.SQRT2 : 1);
        if (ng < gScore[nIdx]) { gScore[nIdx] = ng; cameFrom[nIdx] = cur; open.push([ng + h(nIdx), nIdx]); }
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
    const x = x0 + t * (x1 - x0);
    const y = y0 + t * (y1 - y0);
    if (inWall(x, y)) return -Infinity;
    min = Math.min(min, clearanceAt(x, y));
  }
  return min;
}

function simplify(path: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  let anchor = 0;
  out.push(path[0]);
  while (anchor < path.length - 1) {
    let furthest = anchor + 1;
    for (let j = path.length - 1; j > anchor + 1; j--)
      if (segMinClear(path[anchor][0], path[anchor][1], path[j][0], path[j][1]) >= FREE_MIN) { furthest = j; break; }
    out.push(path[furthest]);
    anchor = furthest;
  }
  return out;
}

// POI stand-point: nearest cell with clearance >= 0.02, main component; else best effort
function relocate(ox: number, oy: number): { pos: [number, number]; moved: number; clr: number } {
  const cand = (x: number, y: number) => {
    const [i, j] = toCellIdx(x, y);
    return free[j * NX + i] && comp[j * NX + i] === MAIN;
  };
  if (clearanceAt(ox, oy) >= 0.02 && !inWall(ox, oy) && cand(ox, oy))
    return { pos: [ox, oy], moved: 0, clr: clearanceAt(ox, oy) };
  let best: [number, number] | null = null;
  let bestScore = -Infinity;
  for (let rad = 0.1; rad <= 1.0; rad += 0.1)
    for (let a = 0; a < 360; a += 8) {
      const x = ox + rad * Math.cos((a * Math.PI) / 180);
      const y = oy + rad * Math.sin((a * Math.PI) / 180);
      if (!cand(x, y) || inWall(x, y)) continue;
      const c = clearanceAt(x, y);
      if (c < 0.02) continue;
      const score = Math.min(c, 0.3) - rad;
      if (score > bestScore) { bestScore = score; best = [x, y]; }
    }
  if (!best) throw new Error(`POI (${ox},${oy}) has no free stand-point within 1.0 m`);
  return { pos: best, moved: Math.hypot(best[0] - ox, best[1] - oy), clr: clearanceAt(best[0], best[1]) };
}

console.log("\n=== repaired routes ===\n");
for (const route of CRAFTSMAN_WALKING_ROUTES) {
  const stands: Array<{ pos: [number, number]; moved: number; clr: number }> = [];
  try {
    for (const wp of route.waypoints) stands.push(relocate(wp.pos[0], wp.pos[1]));
  } catch (e) {
    console.log(`  !! ${route.id}: ${(e as Error).message}`);
    continue;
  }
  stands.forEach((s, i) => {
    if (s.moved > 0)
      console.log(`     relocate ${route.waypoints[i].name}: (${route.waypoints[i].pos[0]},${route.waypoints[i].pos[1]}) -> (${s.pos[0].toFixed(2)},${s.pos[1].toFixed(2)}) moved=${s.moved.toFixed(2)}m clr=${s.clr.toFixed(3)}`);
  });

  const full: [number, number][] = [stands[0].pos];
  let failed = false;
  for (let i = 0; i < stands.length - 1; i++) {
    const seg = astar(toCellIdx(...stands[i].pos), toCellIdx(...stands[i + 1].pos));
    if (!seg) { console.log(`  !! ${route.id}: A* failed "${route.waypoints[i].name}" -> "${route.waypoints[i + 1].name}"`); failed = true; break; }
    full.push(...seg.slice(1));
  }
  if (failed) continue;
  const simple = simplify(full);

  // ordered name attachment
  const names: (string | null)[] = simple.map(() => null);
  let last = -1;
  for (let a = 0; a < stands.length; a++) {
    let bestI = -1, bestD = Infinity;
    for (let i = last + 1; i < simple.length; i++) {
      const d = Math.hypot(simple[i][0] - stands[a].pos[0], simple[i][1] - stands[a].pos[1]);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    names[bestI] = route.waypoints[a].name;
    last = bestI;
  }

  const gates = simple.map((p, i) => ({
    name: names[i] ?? "via",
    pos: [+p[0].toFixed(3), +p[1].toFixed(3)] as [number, number],
    speed: names[i] ? (route.waypoints.find((w) => w.name === names[i])?.speed ?? 0.55) : 0.5,
  }));
  let viaN = 0;
  for (const g of gates) if (g.name === "via") g.name = `via ${++viaN}`;

  let dist = 0, minC = Infinity;
  for (let i = 0; i < gates.length - 1; i++) {
    dist += Math.hypot(gates[i + 1].pos[0] - gates[i].pos[0], gates[i + 1].pos[1] - gates[i].pos[1]);
    minC = Math.min(minC, segMinClear(gates[i].pos[0], gates[i].pos[1], gates[i + 1].pos[0], gates[i + 1].pos[1]));
  }
  console.log(`  ${route.id}: gates=${gates.length} (POIs=${stands.length}) dist=${dist.toFixed(1)}m minClear=${minC === -Infinity ? "WALL!" : minC.toFixed(4)}`);
  for (const g of gates)
    console.log(`    { name: ${JSON.stringify(g.name)}, pos: [${g.pos[0]}, ${g.pos[1]}], speed: ${g.speed} },`);
  console.log();
}
