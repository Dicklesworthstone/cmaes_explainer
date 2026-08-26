import { renderShareCard } from "./_og/shared";

export const alt = "CMA-ES: A Love Letter to My Favorite Black-Box Optimizer — an interactive explainer with live Rust/WASM demos";
// Static prerendering of ImageResponse routes serves empty bodies under
// Turbopack builds — these must stay dynamic (the `ƒ` marker in build output).
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return renderShareCard(size.width, size.height);
}
