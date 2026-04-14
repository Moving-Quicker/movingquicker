import { ImageResponse } from "next/og";

export const alt = "Moving Quicker — Soluciones digitales para tu negocio en México";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #0D9488, #14b8a6, #0D9488)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0D9488 0%, #0f766e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span style={{ color: "#0D9488", fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
            MOVING QUICKER
          </span>
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
            display: "flex",
          }}
        >
          Soluciones digitales para tu negocio
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 700,
            display: "flex",
          }}
        >
          Landing pages · Software a medida · Consultoría digital
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 16,
            color: "#64748b",
            display: "flex",
          }}
        >
          movingquicker.com
        </div>
      </div>
    ),
    { ...size },
  );
}
