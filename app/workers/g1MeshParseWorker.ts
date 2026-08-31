// G1 robot mesh parser worker (cmaes-frontend-mesh-worker).
//
// The flagship pages (G1WalkingFlagship, HouseholdArmFlagship) lazy-mount
// 35 STL meshes (~16 MB total) when the user scrolls within 600px of the
// stage. Previously the STL fetch + `STLLoader.parse` + `computeVertexNormals`
// + `rotateX(-Math.PI/2)` ran synchronously on the main thread when the
// IntersectionObserver fired — enough to starve frames on first paint of /,
// /humanoid, /arm (audit finding P-01). This worker owns fetch + parse +
// normals + rotation; the main thread reconstructs `THREE.BufferGeometry`
// from the returned typed arrays (Three.js types cannot cross the postMessage
// boundary directly).
//
// STL binary format: 80-byte header, then 50-byte records, each holding a
// 12-float32 little-endian triangle (3 normal + 9 vertex = 50 bytes). The
// 12 floats in each record are: 3 normal + 9 vertex (3 verts × 3). We
// collapse all triangles into a non-indexed `position` array and compute
// per-vertex smooth normals by accumulating triangle normals weighted by
// triangle area — equivalent to `geometry.computeVertexNormals()`.

type Msg = {
  type: "parse";
  /** Map of part name -> URL (absolute or same-origin relative). */
  files: Record<string, string>;
  /** Optional rotation: radians around the X axis applied to positions+normals. */
  rotateXRad?: number;
  /** Optional path prefix used to resolve same-origin relative files. */
  baseUrl?: string;
};

type Out =
  | {
      type: "ok";
      geometries: Record<
        string,
        { positions: Float32Array; normals: Float32Array }
      >;
    }
  | { type: "error"; error: string };

const self_ = self as unknown as {
  onmessage: ((e: MessageEvent<Msg>) => void) | null;
  postMessage: (msg: Out, transfer: Transferable[]) => void;
  location: { origin: string };
};

function parseBinarySTL(buffer: ArrayBuffer): Float32Array {
  // Binary STL: 80 bytes header, then uint32 little-endian triangle count,
  // then 50-byte records (12 float32 each: 3 normal, 9 vertex).
  const view = new DataView(buffer);
  if (buffer.byteLength < 84) return new Float32Array(0);
  const triCount = view.getUint32(80, true);
  const expectedBytes = 84 + triCount * 50;
  if (buffer.byteLength < expectedBytes) {
    throw new Error(
      `STL truncated: header says ${triCount} triangles, ${expectedBytes} bytes expected, got ${buffer.byteLength}`,
    );
  }
  // 9 floats per triangle (3 verts × xyz); 12 floats total per record.
  const positions = new Float32Array(triCount * 9);
  for (let t = 0; t < triCount; t++) {
    const base = 84 + t * 50;
    // Skip the 12-byte normal, then read the three vertices. The record's
    // final two bytes are the attribute count.
    for (let v = 0; v < 9; v++) {
      positions[t * 9 + v] = view.getFloat32(base + 12 + v * 4, true);
    }
  }
  return positions;
}

/** Per-vertex smooth normals via area-weighted triangle-normal accumulation. */
function computeSmoothNormals(positions: Float32Array): Float32Array {
  const vertexCount = positions.length / 3;
  const normals = new Float32Array(positions.length);
  const triCount = positions.length / 9;
  for (let t = 0; t < triCount; t++) {
    const i0 = t * 9;
    const ax = positions[i0 + 0];
    const ay = positions[i0 + 1];
    const az = positions[i0 + 2];
    const bx = positions[i0 + 3];
    const by = positions[i0 + 4];
    const bz = positions[i0 + 5];
    const cx = positions[i0 + 6];
    const cy = positions[i0 + 7];
    const cz = positions[i0 + 8];
    const ex = bx - ax;
    const ey = by - ay;
    const ez = bz - az;
    const fx = cx - ax;
    const fy = cy - ay;
    const fz = cz - az;
    // Cross product e × f, magnitude = 2 × triangle area — weights the
    // normal by area, the standard "smooth normal" formula.
    const nx = ey * fz - ez * fy;
    const ny = ez * fx - ex * fz;
    const nz = ex * fy - ey * fx;
    for (let v = 0; v < 3; v++) {
      const idx = t * 9 + v * 3;
      normals[idx + 0] += nx;
      normals[idx + 1] += ny;
      normals[idx + 2] += nz;
    }
  }
  // Normalize each vertex normal in place.
  for (let i = 0; i < vertexCount; i++) {
    const ix = i * 3;
    const x = normals[ix + 0];
    const y = normals[ix + 1];
    const z = normals[ix + 2];
    const len = Math.hypot(x, y, z) || 1;
    const inv = 1 / len;
    normals[ix + 0] = x * inv;
    normals[ix + 1] = y * inv;
    normals[ix + 2] = z * inv;
  }
  return normals;
}

function rotateX(
  positions: Float32Array,
  normals: Float32Array,
  rad: number,
): void {
  // Rotation around X: y' = y cos − z sin, z' = y sin + z cos. Normals use the
  // same matrix (no translation).
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const n = positions.length;
  for (let i = 0; i < n; i += 3) {
    const py = positions[i + 1];
    const pz = positions[i + 2];
    positions[i + 1] = py * c - pz * s;
    positions[i + 2] = py * s + pz * c;
  }
  const m = normals.length;
  for (let i = 0; i < m; i += 3) {
    const ny = normals[i + 1];
    const nz = normals[i + 2];
    normals[i + 1] = ny * c - nz * s;
    normals[i + 2] = ny * s + nz * c;
  }
}

self_.onmessage = async (e: MessageEvent<Msg>) => {
  if (e.data.type !== "parse") return;
  const { files, rotateXRad, baseUrl } = e.data;
  const resolveUrl = (u: string): string => {
    if (/^https?:\/\//i.test(u)) return u;
    if (baseUrl) {
      return new URL(u, new URL(baseUrl, `${self_.location.origin}/`)).toString();
    }
    return new URL(u, self_.location.origin).toString();
  };
  try {
    const entries = await Promise.all(
      Object.entries(files).map(async ([key, file]) => {
        const res = await fetch(resolveUrl(file));
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${file}`);
        const buf = await res.arrayBuffer();
        const positions = parseBinarySTL(buf);
        const normals = computeSmoothNormals(positions);
        if (rotateXRad) rotateX(positions, normals, rotateXRad);
        return [key, { positions, normals }] as const;
      }),
    );
    const geometries: Record<string, { positions: Float32Array; normals: Float32Array }> = {};
    const transfer: Transferable[] = [];
    for (const [key, geo] of entries) {
      geometries[key] = geo;
      transfer.push(geo.positions.buffer, geo.normals.buffer);
    }
    self_.postMessage({ type: "ok", geometries }, transfer);
  } catch (err: unknown) {
    self_.postMessage(
      { type: "error", error: err instanceof Error ? err.message : String(err) },
      [],
    );
  }
};
