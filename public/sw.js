// Minimal service worker for the cmaes_explainer app (P-02).
//
// Caches only the G1 robot mesh files (`/robots/g1/*.STL`, ~16 MB total)
// so a returning visitor does not re-download the binary assets — the
// in-memory parse cache in the main thread (g1MeshCache) still rebuilds
// the geometries, but the 16 MB network round-trip is gone. Cache-First
// strategy: try cache, fall back to network, opportunistically revalidate
// on the next visit. The app shell is not intercepted — the worker only
// owns `/robots/g1/*.STL`, leaving Next.js' chunks and the rest of the
// app untouched. The versioned cache name (`cmaes-robot-meshes-v1`) lets
// us evict by deploying a new file, no manual cleanup required.

const CACHE_NAME = "cmaes-robot-meshes-v1";
const MESH_PREFIX = "/robots/g1/";
const MESH_SUFFIX = ".STL";

self.addEventListener("install", (event) => {
  // Take over immediately so the first controlled page picks up the new
  // SW. The cache is populated lazily on first fetch, so no pre-warming.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith("cmaes-robot-meshes-"))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith(MESH_PREFIX) &&
    url.pathname.toUpperCase().endsWith(MESH_SUFFIX)
  ) {
    event.respondWith(handleMesh(event.request));
  }
});

async function handleMesh(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    // Stale-while-revalidate: serve the cached response, then update in the
    // background. If the network update fails (offline, 404 after deploy)
    // we keep serving the cached body, so the user still sees the mesh.
    fetch(request)
      .then((response) => {
        if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
      })
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    // Offline with nothing cached: the page already shows a graceful
    // capsule fallback (RobotStage without meshes). The real error is
    // surfaced by the main thread's mesh-state hook, not here.
    return new Response("offline and mesh not cached", { status: 504 });
  }
}
