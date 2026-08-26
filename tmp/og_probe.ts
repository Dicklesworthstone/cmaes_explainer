// @ts-nocheck
// Standalone diagnostic: render the share card outside Next to surface the
// real exception behind the silent 0-byte responses.
import { renderShareCard } from "../app/_og/shared";

try {
  const res = await renderShareCard(1200, 630);
  const buf = await res.arrayBuffer();
  console.log("OK bytes:", buf.byteLength);
  await Bun.write("tmp/og_probe.png", buf);
} catch (err) {
  console.error("RENDER FAILED:");
  console.error(err);
}
