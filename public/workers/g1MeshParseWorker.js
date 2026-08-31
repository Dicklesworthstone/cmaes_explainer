// G1 robot mesh parser worker. This file is deliberately plain JavaScript in
// `public/`: native WebKit and the static-export loopback server must receive
// executable JavaScript, not Turbopack's raw TypeScript media artifact.

function parseBinarySTL(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 84) {
    throw new Error(`STL is too short: ${buffer.byteLength} bytes`);
  }
  const triangleCount = view.getUint32(80, true);
  const expectedBytes = 84 + triangleCount * 50;
  if (buffer.byteLength < expectedBytes) {
    throw new Error(
      `STL truncated: header says ${triangleCount} triangles, ${expectedBytes} bytes expected, got ${buffer.byteLength}`,
    );
  }

  const positions = new Float32Array(triangleCount * 9);
  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const record = 84 + triangle * 50;
    for (let value = 0; value < 9; value += 1) {
      // Each 50-byte record starts with a 12-byte normal. Vertex data begins
      // immediately after it; the final two bytes are the attribute count.
      positions[triangle * 9 + value] = view.getFloat32(
        record + 12 + value * 4,
        true,
      );
    }
  }
  return positions;
}

function computeFlatNormals(positions) {
  const normals = new Float32Array(positions.length);
  for (let offset = 0; offset < positions.length; offset += 9) {
    const ax = positions[offset];
    const ay = positions[offset + 1];
    const az = positions[offset + 2];
    const bx = positions[offset + 3];
    const by = positions[offset + 4];
    const bz = positions[offset + 5];
    const cx = positions[offset + 6];
    const cy = positions[offset + 7];
    const cz = positions[offset + 8];
    const edgeABx = bx - ax;
    const edgeABy = by - ay;
    const edgeABz = bz - az;
    const edgeACx = cx - ax;
    const edgeACy = cy - ay;
    const edgeACz = cz - az;
    const normalX = edgeABy * edgeACz - edgeABz * edgeACy;
    const normalY = edgeABz * edgeACx - edgeABx * edgeACz;
    const normalZ = edgeABx * edgeACy - edgeABy * edgeACx;
    const inverseLength = 1 / (Math.hypot(normalX, normalY, normalZ) || 1);
    const nx = normalX * inverseLength;
    const ny = normalY * inverseLength;
    const nz = normalZ * inverseLength;
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const index = offset + vertex * 3;
      normals[index] = nx;
      normals[index + 1] = ny;
      normals[index + 2] = nz;
    }
  }
  return normals;
}

function rotateX(positions, normals, radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  for (let index = 0; index < positions.length; index += 3) {
    const y = positions[index + 1];
    const z = positions[index + 2];
    positions[index + 1] = y * cosine - z * sine;
    positions[index + 2] = y * sine + z * cosine;
  }
  for (let index = 0; index < normals.length; index += 3) {
    const y = normals[index + 1];
    const z = normals[index + 2];
    normals[index + 1] = y * cosine - z * sine;
    normals[index + 2] = y * sine + z * cosine;
  }
}

self.onmessage = async (event) => {
  if (event.data?.type !== "parse") return;
  const { files, rotateXRad = 0, baseUrl = "/" } = event.data;
  try {
    const base = new URL(baseUrl, `${self.location.origin}/`);
    const entries = await Promise.all(
      Object.entries(files).map(async ([key, file]) => {
        const response = await fetch(new URL(file, base));
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} loading ${file}`);
        }
        const positions = parseBinarySTL(await response.arrayBuffer());
        const normals = computeFlatNormals(positions);
        if (rotateXRad) rotateX(positions, normals, rotateXRad);
        return [key, { positions, normals }];
      }),
    );

    const geometries = Object.fromEntries(entries);
    const transfer = entries.flatMap(([, geometry]) => [
      geometry.positions.buffer,
      geometry.normals.buffer,
    ]);
    self.postMessage({ type: "ok", geometries }, transfer);
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
