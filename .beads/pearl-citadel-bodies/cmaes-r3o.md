// cmaes-r3o — Clothing, fabric, and foldable pieces
//
// Background: the kitchen scene has tablecloths, towels, and dish rags. The living room has cushions and curtains. The bedroom has blankets. The current rendering treats all of these as box meshes. The new bead treats them as soft-body surfaces with the same XPBD solver as r3j, with a bending stiffness parameter that makes curtains stiffer than tablecloths.
//
// Stack contents:
//   1. Cloth solver: XPBD with bending stiffness, stretch stiffness, and damping. The mass and constraint graph are produced by the r3c asset factory.
//   2. Curtain hook: a cloth with a pinned top edge; the bottom edge deforms under gravity.
//   3. Tablecloth: a cloth with all four edges pinned to a table; when a plate is placed, the tablecloth deforms under the plate's weight.
//   4. Cushion: a closed soft body with volume preservation (r3j).
//   5. Folding: a hard problem; deferred to a future bead. For now, the cloth pieces are in a single default pose (curtain hangs straight, tablecloth lies flat, cushion sits puffed).
//
// Acceptance:
//   - A curtain in the bedroom: when the window opens, the curtain billows gently and settles.
//   - A tablecloth on the kitchen table: a plate placed on it sinks the cloth slightly, then recovers when the plate is removed.
//   - A cushion on the sofa: the G1's hand presses the cushion and the cushion deforms smoothly.
//
// Citations:
//   - Macklin, Müller 2016 (XPBD, the basis).
//   - Bergou, Wardetzky, Robinson, Audoly, Grinspun 2008 (discrete elastic rods, the bending stiffness model).
//   - Baraff & Witkin 1998 (large steps in cloth simulation, the original cloth).
//   - Bridson, Fedkiw, Anderson 2002 (robust treatment of collisions, contact and friction for cloth).
//   - Müller, Heidelberger, Hennix, Ratcliff 2007 (position based dynamics, the ancestor of XPBD).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3j (soft-body proxies) — blocks
//   - cmaes-r3c (parameterized asset factory) — blocks
