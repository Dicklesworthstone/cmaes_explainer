import * as THREE from "three";

// Procedural furniture meshes: Craftsman-era silhouettes built from
// BufferGeometry primitives. No GLTF/GLB (law 7) — all geometry is
// constructed from the real dimensional table in houseScenes.ts.
// Material palette: warm Craftsman tones.

export const CRAFTSMAN_PALETTE = {
  oakWood: 0x8b6914,
  walnutWood: 0x5c4033,
  brassHardware: 0xb8985a,
  creamWalls: 0xf5f0e8,
  tileFloor: 0xc8c0b0,
  carpetFloor: 0x8b7d6b,
  hardwoodFloor: 0x8b6914,
  fabricSofa: 0x6b7b5e,
  fabricBedding: 0xd4cfc4,
  castIron: 0x2a2d32,
  porcelainWhite: 0xf0ede6,
  steelBrushed: 0xb0b8bc,
  glassWindow: 0xc5dde8,
} as const;

function roundedBox(w: number, h: number, d: number, radius: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2 - radius;
  const hd = d / 2 - radius;
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.quadraticCurveTo(w / 2, -hd, w / 2, -hd);
  shape.lineTo(w / 2, hd);
  shape.quadraticCurveTo(w / 2, hd, hw, hd);
  shape.lineTo(-hw, hd);
  shape.quadraticCurveTo(-w / 2, hd, -w / 2, hd);
  shape.lineTo(-hw, -hd);
  shape.quadraticCurveTo(-w / 2, -hd, -w / 2, -hd);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h - radius * 2, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, h / 2, 0);
  return geo;
}

function taperedCylinder(rTop: number, rBot: number, h: number, seg = 12): THREE.CylinderGeometry {
  return new THREE.CylinderGeometry(rTop, rBot, h, seg);
}

export type FurnitureMeshResult = {
  group: THREE.Group;
  dispose: () => void;
};

export function buildSofa(w: number, d: number, h: number): FurnitureMeshResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const fabric = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.fabricSofa, roughness: 0.85, metalness: 0.02 });
  const wood = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.oakWood, roughness: 0.5, metalness: 0.1 });
  materials.push(fabric, wood);
  // Base
  const baseGeo = roundedBox(w, h * 0.35, d, 0.03);
  geometries.push(baseGeo);
  const base = new THREE.Mesh(baseGeo, fabric);
  base.position.y = h * 0.2;
  base.castShadow = true;
  group.add(base);
  // Backrest
  const backGeo = roundedBox(w, h * 0.55, d * 0.2, 0.03);
  geometries.push(backGeo);
  const back = new THREE.Mesh(backGeo, fabric);
  back.position.set(0, h * 0.65, -d * 0.4);
  back.castShadow = true;
  group.add(back);
  // Arms
  for (const side of [-1, 1]) {
    const armGeo = roundedBox(w * 0.12, h * 0.55, d, 0.03);
    geometries.push(armGeo);
    const arm = new THREE.Mesh(armGeo, fabric);
    arm.position.set(side * (w / 2 - w * 0.06), h * 0.45, 0);
    arm.castShadow = true;
    group.add(arm);
  }
  // Legs (4 tapered)
  for (const [lx, lz] of [[-w/2+0.06, -d/2+0.06], [w/2-0.06, -d/2+0.06], [-w/2+0.06, d/2-0.06], [w/2-0.06, d/2-0.06]]) {
    const legGeo = taperedCylinder(0.022, 0.03, h * 0.2, 8);
    geometries.push(legGeo);
    const leg = new THREE.Mesh(legGeo, wood);
    leg.position.set(lx, h * 0.1, lz);
    group.add(leg);
  }
  // Cushions
  for (const cx of [-w * 0.22, w * 0.22]) {
    const cushGeo = roundedBox(w * 0.44, h * 0.12, d * 0.7, 0.04);
    geometries.push(cushGeo);
    const cush = new THREE.Mesh(cushGeo, fabric);
    cush.position.set(cx, h * 0.41, d * 0.05);
    group.add(cush);
  }
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); } };
}

export function buildDiningTable(w: number, d: number, h: number): FurnitureMeshResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const oak = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.oakWood, roughness: 0.45, metalness: 0.08 });
  materials.push(oak);
  // Tabletop with rounded corners
  const topGeo = roundedBox(w, 0.045, d, 0.02);
  geometries.push(topGeo);
  const top = new THREE.Mesh(topGeo, oak);
  top.position.y = h - 0.02;
  top.castShadow = true;
  group.add(top);
  // 4 turned legs (LatheGeometry for the Craftsman taper)
  const legProfile: THREE.Vector2[] = [];
  const legH = h - 0.045;
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const r = 0.035 - t * 0.015 + Math.sin(t * Math.PI) * 0.008;
    legProfile.push(new THREE.Vector2(Math.max(r, 0.012), t * legH));
  }
  const legGeo = new THREE.LatheGeometry(legProfile, 10);
  geometries.push(legGeo);
  for (const [lx, lz] of [[-w/2+0.08, -d/2+0.08], [w/2-0.08, -d/2+0.08], [-w/2+0.08, d/2-0.08], [w/2-0.08, d/2-0.08]]) {
    const leg = new THREE.Mesh(legGeo, oak);
    leg.position.set(lx, 0, lz);
    leg.castShadow = true;
    group.add(leg);
  }
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); } };
}

export function buildBookshelf(w: number, d: number, h: number): FurnitureMeshResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const walnut = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.walnutWood, roughness: 0.42, metalness: 0.08 });
  materials.push(walnut);
  // Side panels
  for (const side of [-1, 1]) {
    const geo = new THREE.BoxGeometry(0.025, h, d);
    geometries.push(geo);
    const panel = new THREE.Mesh(geo, walnut);
    panel.position.set(side * (w / 2 - 0.0125), h / 2, 0);
    panel.castShadow = true;
    group.add(panel);
  }
  // Back panel
  const backGeo = new THREE.BoxGeometry(w, h, 0.012);
  geometries.push(backGeo);
  const back = new THREE.Mesh(backGeo, walnut);
  back.position.set(0, h / 2, -d / 2 + 0.006);
  group.add(back);
  // Shelves (5 including top and bottom)
  const shelfCount = 5;
  for (let i = 0; i < shelfCount; i++) {
    const sy = (h / (shelfCount - 1)) * i;
    const shelfGeo = new THREE.BoxGeometry(w - 0.05, 0.018, d);
    geometries.push(shelfGeo);
    const shelf = new THREE.Mesh(shelfGeo, walnut);
    shelf.position.y = sy;
    shelf.castShadow = true;
    group.add(shelf);
    // Books (small colored boxes on each shelf except top)
    if (i < shelfCount - 1) {
      const bookColors = [0x8b3a3a, 0x3a5f8b, 0x3a8b5f, 0x8b7a3a];
      const bookCount = Math.floor(w / 0.045);
      for (let b = 0; b < bookCount; b++) {
        if (Math.random() > 0.85) continue; // some gaps
        const bw = 0.028 + (b % 3) * 0.008;
        const bh = 0.16 + (b % 4) * 0.02;
        const bookGeo = new THREE.BoxGeometry(bw, bh, d * 0.72);
        geometries.push(bookGeo);
        const bookMat = new THREE.MeshStandardMaterial({
          color: bookColors[b % bookColors.length],
          roughness: 0.7, metalness: 0.0
        });
        materials.push(bookMat);
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.position.set(-w / 2 + 0.04 + b * 0.045, sy + 0.012 + bh / 2, 0);
        group.add(book);
      }
    }
  }
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); } };
}

export function buildBed(w: number, d: number, h: number): FurnitureMeshResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const frame = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.castIron, roughness: 0.35, metalness: 0.65 });
  const mattress = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.fabricBedding, roughness: 0.9, metalness: 0.0 });
  const pillow = new THREE.MeshStandardMaterial({ color: 0xf0ede6, roughness: 0.85 });
  materials.push(frame, mattress, pillow);
  // Frame
  const frameGeo = new THREE.BoxGeometry(w + 0.06, 0.12, d + 0.06);
  geometries.push(frameGeo);
  const frameMesh = new THREE.Mesh(frameGeo, frame);
  frameMesh.position.y = h * 0.35;
  group.add(frameMesh);
  // Headboard
  const hbGeo = new THREE.BoxGeometry(w + 0.06, h * 0.55, 0.04);
  geometries.push(hbGeo);
  const headboard = new THREE.Mesh(hbGeo, frame);
  headboard.position.set(0, h * 0.55, -d / 2 - 0.02);
  headboard.castShadow = true;
  group.add(headboard);
  // Mattress
  const matGeo = new THREE.BoxGeometry(w, 0.16, d);
  geometries.push(matGeo);
  const mattressMesh = new THREE.Mesh(matGeo, mattress);
  mattressMesh.position.y = h * 0.35 + 0.08 + 0.08;
  mattressMesh.castShadow = true;
  group.add(mattressMesh);
  // Pillows
  for (const px of [-w * 0.2, w * 0.2]) {
    const pilGeo = new THREE.BoxGeometry(w * 0.35, 0.09, d * 0.25);
    geometries.push(pilGeo);
    const pillowMesh = new THREE.Mesh(pilGeo, pillow);
    pillowMesh.position.set(px, h * 0.35 + 0.16 + 0.08, -d * 0.3);
    group.add(pillowMesh);
  }
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); } };
}

export function buildStove(w: number, d: number, h: number): FurnitureMeshResult {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const iron = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.castIron, roughness: 0.3, metalness: 0.7 });
  const chrome = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.steelBrushed, roughness: 0.15, metalness: 0.9 });
  const white = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.porcelainWhite, roughness: 0.2, metalness: 0.1 });
  materials.push(iron, chrome, white);
  // Body
  const bodyGeo = new THREE.BoxGeometry(w, h, d);
  geometries.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, iron);
  body.position.y = h / 2;
  body.castShadow = true;
  group.add(body);
  // Cooktop (slightly wider plate)
  const cookGeo = new THREE.BoxGeometry(w + 0.02, 0.02, d + 0.02);
  geometries.push(cookGeo);
  const cooktop = new THREE.Mesh(cookGeo, chrome);
  cooktop.position.y = h + 0.01;
  group.add(cooktop);
  // Burners (4 circles)
  for (const [bx, bz] of [[-w*0.22, -d*0.2], [w*0.22, -d*0.2], [-w*0.22, d*0.2], [w*0.22, d*0.2]]) {
    const burnerGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.008, 20);
    geometries.push(burnerGeo);
    const burner = new THREE.Mesh(burnerGeo, iron);
    burner.position.set(bx, h + 0.02, bz);
    group.add(burner);
  }
  // Oven door (recessed panel)
  const doorGeo = new THREE.BoxGeometry(w * 0.85, h * 0.42, 0.015);
  geometries.push(doorGeo);
  const door = new THREE.Mesh(doorGeo, white);
  door.position.set(0, h * 0.32, d / 2 + 0.008);
  group.add(door);
  // Handle
  const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, w * 0.8, 8);
  geometries.push(handleGeo);
  const handle = new THREE.Mesh(handleGeo, chrome);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0, h * 0.58, d / 2 + 0.03);
  group.add(handle);
  return { group, dispose: () => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); } };
}

// Factory: build any furniture piece by name.
export function buildFurniture(name: string, w: number, d: number, h: number): FurnitureMeshResult {
  switch (name) {
    case "sofa": return buildSofa(w, d, h);
    case "dining-table": return buildDiningTable(w, d, h);
    case "bookshelf": return buildBookshelf(w, d, h);
    case "bed-master": return buildBed(w, d, h);
    case "stove": return buildStove(w, d, h);
    default: {
      // Generic box with Craftsman tone (fireplace, dresser, kitchen-island, etc.)
      const group = new THREE.Group();
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color: CRAFTSMAN_PALETTE.walnutWood, roughness: 0.55, metalness: 0.08 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = h / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return { group, dispose: () => { geo.dispose(); mat.dispose(); } };
    }
  }
}

// Room floor rendering: material per room type.
export function roomFloorMaterial(roomName: string): THREE.MeshStandardMaterial {
  const palette = CRAFTSMAN_PALETTE;
  if (roomName.includes("kitchen") || roomName.includes("bath"))
    return new THREE.MeshStandardMaterial({ color: palette.tileFloor, roughness: 0.35, metalness: 0.05 });
  if (roomName.includes("bedroom"))
    return new THREE.MeshStandardMaterial({ color: palette.carpetFloor, roughness: 0.92, metalness: 0.0 });
  return new THREE.MeshStandardMaterial({ color: palette.hardwoodFloor, roughness: 0.4, metalness: 0.05 });
}
