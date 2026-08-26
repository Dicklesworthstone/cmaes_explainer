import { ImageResponse } from "next/og";
import {
  JETBRAINS_MONO_MEDIUM_B64,
  MANROPE_EXTRA_BOLD_B64,
  MANROPE_MEDIUM_B64,
} from "./fontData";

/**
 * Shared machinery for app/opengraph-image.tsx and app/twitter-image.tsx.
 *
 * Satori constraints honored here (violations crash silently with empty bodies):
 * - Every JSX element carries display:"flex".
 * - No .map() anywhere inside JSX (elements are written out explicitly);
 *   all geometry is precomputed at module scope into flat constants.
 * - SVG limited to <defs> <linearGradient> <stop> <circle> <rect> <path> <line>;
 *   rotated ellipses become <path> outlines (never <polygon>/<g transform>).
 * - Only linear-gradient / radial-gradient; hex colors only; inline styles only.
 */

type BrandFont = {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 800;
  style: "normal";
};

let fontCache: BrandFont[] | null = null;

function decodeFont(b64: string): ArrayBuffer {
  const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
  return bytes.buffer;
}

// Fonts are embedded as base64 (see fontData.ts) rather than fetched:
// Turbopack's server-side fetch does not support file: URLs, and fs-based
// loading would break if the route ever executes outside a build with full
// repo files traced (e.g. Vercel serverless).
export async function loadBrandFonts(): Promise<BrandFont[]> {
  if (fontCache) return fontCache;
  const [manropeExtraBold, manropeMedium, jetBrainsMono] = await Promise.all([
    Promise.resolve(decodeFont(MANROPE_EXTRA_BOLD_B64)),
    Promise.resolve(decodeFont(MANROPE_MEDIUM_B64)),
    Promise.resolve(decodeFont(JETBRAINS_MONO_MEDIUM_B64)),
  ]);
  fontCache = [
    { name: "Manrope", data: manropeExtraBold, weight: 800, style: "normal" },
    { name: "Manrope", data: manropeMedium, weight: 500, style: "normal" },
    { name: "JetBrains Mono", data: jetBrainsMono, weight: 500, style: "normal" },
  ];
  return fontCache;
}

// ---------------------------------------------------------------------------
// Geometry helpers (module scope, deterministic — no randomness, no React).
// ---------------------------------------------------------------------------

/** Rotated ellipse outline as an SVG path (Satori-safe replacement for <ellipse transform>). */
function ellipsePath(cx: number, cy: number, a: number, b: number, rotDeg: number): string {
  const rot = (rotDeg * Math.PI) / 180;
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);
  const steps = 72;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const ex = a * Math.cos(t);
    const ey = b * Math.sin(t);
    const x = cx + ex * cosR - ey * sinR;
    const y = cy + ex * sinR + ey * cosR;
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  return d + "Z";
}

/** Catmull-Rom spline through waypoints, emitted as cubic beziers. */
function smoothPath(pts: Array<[number, number]>): string {
  let d = "M " + pts[0][0] + " " + pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d +=
      " C " +
      c1x.toFixed(2) + " " + c1y.toFixed(2) + ", " +
      c2x.toFixed(2) + " " + c2y.toFixed(2) + ", " +
      p2[0].toFixed(2) + " " + p2[1].toFixed(2);
  }
  return d;
}

/** Small direction arrow (filled triangle) pointing along `angleDeg` at (x,y). */
function arrowAt(x: number, y: number, angleDeg: number, size: number): string {
  const a = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const vx = -uy;
  const vy = ux;
  const tipX = x + ux * size;
  const tipY = y + uy * size;
  const bx = x - ux * size * 0.6;
  const by = y - uy * size * 0.6;
  return (
    "M " + tipX.toFixed(2) + " " + tipY.toFixed(2) +
    " L " + (bx + vx * size * 0.55).toFixed(2) + " " + (by + vy * size * 0.55).toFixed(2) +
    " L " + (bx - vx * size * 0.55).toFixed(2) + " " + (by - vy * size * 0.55).toFixed(2) +
    " Z"
  );
}

// Scene layout constants (viewBox space 440 x 440).
const OPT_X = 302;
const OPT_Y = 248;
const VALLEY_ROT = -28;

const CONTOURS: Array<{ d: string; opacity: number; width: number }> = [
  { d: ellipsePath(OPT_X, OPT_Y, 196, 88, VALLEY_ROT), opacity: 0.1, width: 1.5 },
  { d: ellipsePath(OPT_X, OPT_Y, 156, 70, VALLEY_ROT), opacity: 0.17, width: 1.7 },
  { d: ellipsePath(OPT_X, OPT_Y, 116, 52, VALLEY_ROT), opacity: 0.26, width: 1.9 },
  { d: ellipsePath(OPT_X, OPT_Y, 76, 34, VALLEY_ROT), opacity: 0.4, width: 2.1 },
  { d: ellipsePath(OPT_X, OPT_Y, 38, 17, VALLEY_ROT), opacity: 0.58, width: 2.3 },
];

const TRAJECTORY_D = smoothPath([
  [58, 58],
  [148, 116],
  [222, 178],
  [268, 218],
  [292, 240],
]);

const MEAN_MARKERS: Array<{ x: number; y: number; r: number; fill: string }> = [
  { x: 58, y: 58, r: 7.5, fill: "#818cf8" },
  { x: 148, y: 116, r: 6.5, fill: "#60a5fa" },
  { x: 222, y: 178, r: 5.5, fill: "#22d3ee" },
  { x: 268, y: 218, r: 4.5, fill: "#34d399" },
];

const ARROW_1 = arrowAt(184, 146, 40, 10);
const ARROW_2 = arrowAt(246, 199, 43, 9);

// Final distribution: mean + covariance ellipse + sample cloud.
const FINAL_MEAN_X = 274;
const FINAL_MEAN_Y = 226;
const COV_ELLIPSE_D = ellipsePath(FINAL_MEAN_X, FINAL_MEAN_Y, 62, 24, -22);
const COV_HALO_D = ellipsePath(FINAL_MEAN_X, FINAL_MEAN_Y, 77, 31, -22);

type Dot = { x: number; y: number; r: number; fill: string; opacity: number };

function sampleDot(alongMajor: number, alongMinor: number, r: number, fill: string, opacity: number): Dot {
  const a = (-20 * Math.PI) / 180;
  return {
    x: FINAL_MEAN_X + alongMajor * Math.cos(a) - alongMinor * Math.sin(a),
    y: FINAL_MEAN_Y + alongMajor * Math.sin(a) + alongMinor * Math.cos(a),
    r,
    fill,
    opacity,
  };
}

// Hand-authored Gaussian-ish cloud stretched along the covariance major axis.
const D0 = sampleDot(46, -4, 3.6, "#34d399", 0.95);
const D1 = sampleDot(20, 9, 3.2, "#34d399", 0.95);
const D2 = sampleDot(-32, 7, 3.4, "#34d399", 0.95);
const D3 = sampleDot(-8, -14, 3.0, "#34d399", 0.85);
const D4 = sampleDot(11, -17, 2.9, "#38bdf8", 0.8);
const D5 = sampleDot(-13, -12, 2.8, "#38bdf8", 0.8);
const D6 = sampleDot(-50, -3, 3.1, "#38bdf8", 0.75);
const D7 = sampleDot(-72, 7, 2.6, "#818cf8", 0.65);
const D8 = sampleDot(27, 19, 2.9, "#38bdf8", 0.75);
const D9 = sampleDot(-26, 21, 3.0, "#38bdf8", 0.7);
const D10 = sampleDot(62, -11, 2.7, "#818cf8", 0.6);
const D11 = sampleDot(-61, 17, 2.5, "#818cf8", 0.55);
const D12 = sampleDot(43, -21, 2.4, "#818cf8", 0.55);
const D13 = sampleDot(6, 25, 2.6, "#38bdf8", 0.65);

// ---------------------------------------------------------------------------
// The card.
// ---------------------------------------------------------------------------

export async function renderShareCard(width: number, height: number): Promise<ImageResponse> {
  const fonts = await loadBrandFonts();
  const compact = height < 620; // twitter 1200x600 variant
  const titleSize = compact ? 108 : 122;
  const panelSize = compact ? 434 : 462;
  const padLeft = compact ? 8 : 16;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#020617",
          color: "#f8fafc",
          overflow: "hidden",
          fontFamily: "Manrope", // registered font — "Geist" was never loaded and falls back
          padding: compact ? "44px 48px" : "56px 48px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -60,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.05) 45%, transparent 68%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 62%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 380,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Left column: copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 600,
            paddingLeft: padLeft,
            paddingRight: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,0.35)",
              background: "rgba(56,189,248,0.08)",
              marginBottom: compact ? 22 : 26,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22d3ee", display: "flex" }} />
            <span
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 3,
                color: "#7dd3fc",
              }}
            >
              AN INTERACTIVE EXPLAINER
            </span>
          </div>

          <h1
            style={{
              display: "flex",
              margin: 0,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              background: "linear-gradient(105deg, #f8fafc 0%, #e0f2fe 38%, #7dd3fc 68%, #38bdf8 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            CMA-ES
          </h1>

          <div
            style={{
              display: "flex",
              marginTop: compact ? 14 : 18,
              maxWidth: 520,
              fontSize: 29,
              fontWeight: 500,
              lineHeight: 1.35,
              color: "#e2e8f0",
            }}
          >
            A love letter to my favorite black-box optimizer
          </div>

          <div
            style={{
              display: "flex",
              marginTop: compact ? 14 : 18,
              maxWidth: 512,
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.55,
              color: "#94a3b8",
            }}
          >
            Watch a population learn the shape of a landscape — then run the real
            Rust engine live in your browser.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: compact ? 20 : 26 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(15,23,42,0.6)",
              }}
            >
              <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 13, color: "#cbd5e1" }}>
                Living visualizations
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(15,23,42,0.6)",
              }}
            >
              <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 13, color: "#cbd5e1" }}>
                Rust → WebAssembly
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(15,23,42,0.6)",
              }}
            >
              <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 13, color: "#cbd5e1" }}>
                Live demos
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: compact ? 30 : 40 }}>
            <div
              style={{
                width: 44,
                height: 2,
                display: "flex",
                background: "linear-gradient(90deg, #38bdf8, rgba(56,189,248,0))",
              }}
            />
            <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 15, color: "#7dd3fc" }}>
              cmaesexplainer.vercel.app
            </span>
          </div>
        </div>

        {/* Right column: the CMA-ES motif on a glass panel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: panelSize,
              padding: "26px 14px 20px 14px",
              borderRadius: 30,
              border: "1px solid rgba(148,163,184,0.22)",
              background: "rgba(10,16,30,0.55)",
              boxShadow: "0 24px 80px rgba(2,6,23,0.6)",
            }}
          >
            <svg
              width={panelSize - 44}
              height={panelSize - 44}
              viewBox="0 0 440 440"
              fill="none"
              style={{ filter: "drop-shadow(0 0 26px rgba(56,189,248,0.22))", display: "flex" }}
            >
              <defs>
                <linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="55%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Fitness contours (outermost first) */}
              <path d={CONTOURS[0].d} stroke="#38bdf8" strokeWidth={CONTOURS[0].width} opacity={CONTOURS[0].opacity} fill="none" />
              <path d={CONTOURS[1].d} stroke="#38bdf8" strokeWidth={CONTOURS[1].width} opacity={CONTOURS[1].opacity} fill="none" />
              <path d={CONTOURS[2].d} stroke="#38bdf8" strokeWidth={CONTOURS[2].width} opacity={CONTOURS[2].opacity} fill="none" />
              <path d={CONTOURS[3].d} stroke="#38bdf8" strokeWidth={CONTOURS[3].width} opacity={CONTOURS[3].opacity} fill="none" />
              <path d={CONTOURS[4].d} stroke="#38bdf8" strokeWidth={CONTOURS[4].width} opacity={CONTOURS[4].opacity} fill="none" />
              <path d={CONTOURS[4].d} fill="rgba(56,189,248,0.07)" stroke="none" />

              {/* Mean trajectory */}
              <path d={TRAJECTORY_D} stroke="url(#trajGrad)" strokeWidth={3.6} strokeLinecap="round" fill="none" opacity={0.95} />

              {/* Direction arrows */}
              <path d={ARROW_1} fill="#22d3ee" opacity={0.85} />
              <path d={ARROW_2} fill="#34d399" opacity={0.85} />

              {/* Historic means, shrinking */}
              <circle cx={MEAN_MARKERS[0].x} cy={MEAN_MARKERS[0].y} r={MEAN_MARKERS[0].r} fill={MEAN_MARKERS[0].fill} opacity={0.9} />
              <circle cx={MEAN_MARKERS[1].x} cy={MEAN_MARKERS[1].y} r={MEAN_MARKERS[1].r} fill={MEAN_MARKERS[1].fill} opacity={0.9} />
              <circle cx={MEAN_MARKERS[2].x} cy={MEAN_MARKERS[2].y} r={MEAN_MARKERS[2].r} fill={MEAN_MARKERS[2].fill} opacity={0.9} />
              <circle cx={MEAN_MARKERS[3].x} cy={MEAN_MARKERS[3].y} r={MEAN_MARKERS[3].r} fill={MEAN_MARKERS[3].fill} opacity={0.9} />

              {/* Adapted covariance ellipsoid */}
              <path d={COV_HALO_D} stroke="#34d399" strokeWidth={6} opacity={0.16} fill="none" />
              <path d={COV_ELLIPSE_D} stroke="#34d399" strokeWidth={3} opacity={0.95} fill="rgba(52,211,153,0.06)" />

              {/* Sample population (elites first, then the rest) */}
              <circle cx={D0.x} cy={D0.y} r={D0.r} fill={D0.fill} opacity={D0.opacity} />
              <circle cx={D1.x} cy={D1.y} r={D1.r} fill={D1.fill} opacity={D1.opacity} />
              <circle cx={D2.x} cy={D2.y} r={D2.r} fill={D2.fill} opacity={D2.opacity} />
              <circle cx={D3.x} cy={D3.y} r={D3.r} fill={D3.fill} opacity={D3.opacity} />
              <circle cx={D4.x} cy={D4.y} r={D4.r} fill={D4.fill} opacity={D4.opacity} />
              <circle cx={D5.x} cy={D5.y} r={D5.r} fill={D5.fill} opacity={D5.opacity} />
              <circle cx={D6.x} cy={D6.y} r={D6.r} fill={D6.fill} opacity={D6.opacity} />
              <circle cx={D7.x} cy={D7.y} r={D7.r} fill={D7.fill} opacity={D7.opacity} />
              <circle cx={D8.x} cy={D8.y} r={D8.r} fill={D8.fill} opacity={D8.opacity} />
              <circle cx={D9.x} cy={D9.y} r={D9.r} fill={D9.fill} opacity={D9.opacity} />
              <circle cx={D10.x} cy={D10.y} r={D10.r} fill={D10.fill} opacity={D10.opacity} />
              <circle cx={D11.x} cy={D11.y} r={D11.r} fill={D11.fill} opacity={D11.opacity} />
              <circle cx={D12.x} cy={D12.y} r={D12.r} fill={D12.fill} opacity={D12.opacity} />
              <circle cx={D13.x} cy={D13.y} r={D13.r} fill={D13.fill} opacity={D13.opacity} />

              {/* Optimum */}
              <circle cx={OPT_X} cy={OPT_Y} r={18} fill="rgba(52,211,153,0.18)" />
              <circle cx={OPT_X} cy={OPT_Y} r={11} stroke="rgba(255,255,255,0.55)" strokeWidth={1.4} fill="none" />
              <circle cx={OPT_X} cy={OPT_Y} r={5.5} fill="#ffffff" />
            </svg>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", display: "flex" }} />
                <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 12.5, color: "#94a3b8" }}>contours</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "flex" }} />
                <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 12.5, color: "#94a3b8" }}>covariance</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#818cf8", display: "flex" }} />
                <span style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 12.5, color: "#94a3b8" }}>samples</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            display: "flex",
            background: "linear-gradient(90deg, transparent 0%, #38bdf8 28%, #22d3ee 55%, #34d399 80%, transparent 100%)",
          }}
        />
      </div>
    ),
    { width, height, fonts }
  );
}
