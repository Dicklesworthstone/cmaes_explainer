import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Unitree G1 Humanoid Walking — 5,040-D CMA-ES Simulation";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        background:
          "linear-gradient(145deg, #050b18 0%, #0a1626 55%, #050b18 100%)",
        padding: "56px 72px",
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
            padding: "8px 20px",
            background: "rgba(8, 22, 38, 0.8)",
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: "#22d3ee",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: 6,
              color: "#a5f3fc",
              display: "flex",
            }}
          >
            LIVE PHYSICS · ZERO GRADIENTS
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "baseline",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {"Unitree G1: "}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            backgroundImage:
              "linear-gradient(90deg, #38bdf8, #22d3ee, #818cf8)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {"learn to walk"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#94a3b8",
          maxWidth: 980,
        }}
      >
        {
          "CMA-ES optimizes a 5,040-parameter policy inside a real articulated-dynamics kernel — in your browser."
        }
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        <div
          style={{
            display: "flex",
            padding: "10px 20px",
            borderRadius: 12,
            border: "1px solid rgba(125,211,252,0.3)",
            background: "rgba(8, 22, 38, 0.8)",
            color: "#bae6fd",
            fontSize: 21,
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
            color: "#bae6fd",
            fontSize: 21,
          }}
        >
          5,040 weights
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderRadius: 12,
            border: "1px solid rgba(125,211,252,0.3)",
            background: "rgba(8, 22, 38, 0.8)",
            color: "#bae6fd",
            fontSize: 21,
          }}
        >
          no gradients
        </div>
      </div>
    </div>,
    { ...size },
  );
}
