import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KUKA LBR iiwa 7 R800 Pick-and-Place — 128-D CMA-ES Simulation";
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
              color: "#fed7aa",
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
          {"KUKA iiwa 7 R800: "}
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
          {"pick, carry, place"}
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
          "CMA-ES drives 128 joint-curve variables through a real contact-and-friction rollout — grasp verified by the receipt."
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
            color: "#fed7aa",
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
            color: "#fed7aa",
            fontSize: 21,
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
            fontSize: 21,
          }}
        >
          piecewise black-box
        </div>
      </div>
    </div>,
    { ...size },
  );
}
