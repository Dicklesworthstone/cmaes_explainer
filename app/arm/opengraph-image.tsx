import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KUKA iiwa14 Pick-and-Place — 128-D CMA-ES Simulation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(145deg, #050b18 0%, #0a1626 55%, #050b18 100%)",
        padding: "64px 72px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(125,211,252,0.35)",
            borderRadius: 999,
            padding: "10px 22px",
            background: "rgba(8, 22, 38, 0.8)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#22d3ee",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#fed7aa",
              display: "flex",
            }}
          >
            LIVE PHYSICS · ZERO GRADIENTS
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          {"KUKA iiwa14:"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(90deg, #38bdf8, #22d3ee, #818cf8)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {"pick, carry, place"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#94a3b8",
            marginTop: 18,
            maxWidth: 900,
          }}
        >
          {
            "CMA-ES drives 128 joint-curve variables through a real contact-and-friction rollout — grasp verified by the receipt."
          }
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid rgba(125,211,252,0.3)",
              background: "rgba(8, 22, 38, 0.8)",
              color: "#fed7aa",
              fontSize: 22,
            }}
          >
            29 DoF · 480 Hz
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid rgba(125,211,252,0.3)",
              background: "rgba(8, 22, 38, 0.8)",
              color: "#fed7aa",
              fontSize: 22,
            }}
          >
            128 variables
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid rgba(125,211,252,0.3)",
              background: "rgba(8, 22, 38, 0.8)",
              color: "#fed7aa",
              fontSize: 22,
            }}
          >
            piecewise black-box
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#38bdf8",
            fontSize: 24,
            fontFamily: "monospace",
          }}
        >
          cmaesexplainer.vercel.app/arm
        </div>
      </div>

      <svg
        width="1200"
        height="6"
        viewBox="0 0 1200 6"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="6" fill="url(#accent)" />
      </svg>
    </div>,
    { ...size },
  );
}
